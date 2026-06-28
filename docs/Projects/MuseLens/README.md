# MuseLens

本仓库为 MuseLens 前后端代码。后端为 FastAPI（Router、Lens 目录、可选 ComfyUI 执行链等），前端为 Flutter。

## 阿里云部署（ECS + MinIO + FC Adapter）

当前仓库已按如下生产早期架构做了落地：

- `docker-compose.backend.yml` 单文件部署 `nginx + backend + postgres + minio + fc-adapter`
- `backend` 不再把 ComfyUI 当作本地共享目录使用，图片改为对象引用驱动
- 用户上传图、遮罩图、步骤中间图、结果图统一走对象存储
- `fc-adapter` 负责连接阿里云 FC 上的 ComfyUI 原生接口
- 返回给前端的 `result_url` / `preview_url` 改为对象存储访问地址或后端代理地址

### 部署前你需要准备

- 一台 `ECS 2C4G 40G`
- 域名并解析到 ECS 公网 IP
- 阿里云 FC GPU 函数，内部启动 ComfyUI，并暴露原生接口
- SSL 证书文件：
  - `fullchain.pem`
  - `privkey.pem`
  - 放到 `.env` 中 `MUSELENS_NGINX_CERT_DIR` 指定的目录

### 目录准备

在 ECS 上创建：

```bash
sudo mkdir -p /data/muselens/postgres
sudo mkdir -p /data/muselens/minio
sudo mkdir -p /data/muselens/backend-tmp
sudo mkdir -p /data/muselens/nginx/certs
```

### 环境变量

```bash
cp .env.docker.example .env
```

至少补齐这些值：

- `PUBLIC_API_BASE_URL`
- `MUSELENS_LLM_BASE_URL`
- `MUSELENS_LLM_API_KEY`
- `MUSELENS_LLM_MODEL`
- `MINIO_ROOT_USER`
- `MINIO_ROOT_PASSWORD`
- `MUSELENS_MINIO_ACCESS_KEY`
- `MUSELENS_MINIO_SECRET_KEY`
- `MUSELENS_FC_COMFY_BASE_URL`
- `MUSELENS_FC_ADAPTER_TOKEN`

如果你希望前端直接使用 MinIO 签名 URL，还需要配置：

- `MUSELENS_MINIO_PUBLIC_ENDPOINT`
- `MUSELENS_MINIO_PUBLIC_SECURE`

否则后端会退回到 `/api/v1/storage/object?ref=...` 代理访问模式。

### 启动

```bash
docker compose -f docker-compose.backend.yml up -d --build
```

### MinIO 初始化

服务启动后，进入 MinIO Console 创建 bucket：

- `muselens-input`
- `muselens-output`
- `muselens-temp`

建议给 `muselens-temp` 配生命周期清理规则。

### 上线验证

- `https://<your-domain>/docs`
- `https://<your-domain>/`
- `GET /api/v1/storage/object?ref=...` 可访问对象
- 上传底图后，返回值中的 `filename` 将是对象引用，例如 `minio://muselens-input/...`
- `route_and_run` / `lenses/run` 返回的 `result_url` 应可直接预览

## 合作者如何复现（推荐：Docker）

按下面顺序可在本机得到与团队一致的 **PostgreSQL（pgvector）+ 后端 API**，无需先装本机 Python 数据库服务。

### 1. 克隆与前置

- 安装 **Git**、**Docker Desktop**（或兼容的 Docker Engine + Compose V2），并确保 Docker 已启动。
- 克隆仓库后，**所有 compose 与 `.env` 相关命令均在仓库根目录**（包含 `docker-compose.backend.yml` 的那一层）执行。

### 2. 环境变量（必做）

Compose 只会自动读取 **仓库根目录**下的 `.env`（不会读取 `backend/.env`）。

```bash
cp .env.docker.example .env
# Windows PowerShell: Copy-Item .env.docker.example .env
```

用编辑器打开根目录 `.env`，至少配置 **Planner / Router 用的 LLM**（与团队对齐网关与模型名）：

- `MUSELENS_LLM_BASE_URL`（如 OpenAI 兼容或 SiliconFlow 等）
- `MUSELENS_LLM_API_KEY`
- `MUSELENS_LLM_MODEL`

`MUSELENS_POSTGRES_PASSWORD`、`MUSELENS_POSTGRES_PORT` 可与 `.env.docker.example` 保持一致，除非本地 5433 已被占用。

> **注意**：含密钥的 `.env` 已在 `.gitignore` 中，**勿提交**。

### 3. 构建并启动

```bash
docker compose -f docker-compose.backend.yml build
docker compose -f docker-compose.backend.yml up -d
```
我在服务器上用
```bash 
docker-compose -f docker-compose.backend.yml up -d --build
```

首次或依赖变更后可用 `build --no-cache`。

### 4. 验证

- 浏览器打开 **http://127.0.0.1:8000/docs**（或你修改 `MUSELENS_BACKEND_PORT` 后的端口）。
- 根路径 **http://127.0.0.1:8000/** 返回 JSON 即表示进程正常。

### 5. 可选后续步骤

| 目的 | 说明 |
|------|------|
| **pgvector 检索与 Router** | 需 LLM 配置正确；Lens 注册后可在容器内执行 `python -m app.scripts.sync_lens_embeddings_cli` 同步向量（详见 `docs/Router层详细说明.md`）。 |
| **本机 ComfyUI（生图）** | 在宿主机启动 ComfyUI（默认 8188）。容器已通过 `host.docker.internal:8188` 访问宿主机；未启动 ComfyUI 仍可测数据库与 Router/LLM。 |
| **跑后端测试** | 栈已启动后：`docker compose -f docker-compose.backend.yml exec backend python -m pytest tests/ -q`（容器工作目录为 `/app`，即 backend 内容）。 |
| **真实 LLM 集成测试** | 需在容器内设置 `MUSELENS_TEST_REAL_LLM=1` 等，见 `docs/Router层-意图编排与实现对照.md` 中测试说明。 |

### 6. 文档索引

- Router 层总览：[docs/Router层详细说明.md](docs/Router层详细说明.md)
- Docker 与知识库：[docs/Router架构与Lens知识库指南.md](docs/Router架构与Lens知识库指南.md)

---

# 项目结构

后端目录结构

```Plain
backend/
├── app/
│   ├── __init__.py
│   ├── main.py              # 入口文件：启动 FastAPI，挂载路由
│   ├── core/                # 核心配置
│   ├── models/              # 数据库模型 (ORM)
│   ├── schemas/             # Pydantic 数据模型
│   │   ├── lens.py          # [v3.0/Phase 2] A1-A5 LensAsset/LensParam 资产分离与拓扑定义
│   ├── api/                 # API 路由层
│   │   └── v1/
│   │       ├── endpoints/
│   │       │   ├── editor.py    # [Phase 2] 基于 WebSocket 的实时非阻塞推理流
│   │       │   └── test_run.py  # [Phase 2] 测试本地 A1->A2 异步 DAG 盲执行管线
│   ├── lenses/              # [v3.0 核心] 透镜注册表与实例化
│   │   └── registry.py      # 将 JSON 工作流注册为 Python 对象
│   └── services/            # 业务逻辑层
│       ├── compiler.py      # [v3.0 核心] 盲执行器、沙盒参数注入中心
│       └── comfy_service.py # 封装与 ComfyUI 的通信
├── .gitignore
└── requirements.txt
```

环境变量：使用 Docker Compose 时请在**仓库根目录**配置 `.env`（见上文「合作者如何复现」）。

### 核心架构理念 (v3.0)
系统后端架构遵循 **AOT链接 (Ahead-Of-Time Linking)** 与 **盲执行管线 (Blind Execution Pipeline)**，核心分为以下层：
1. **意图路由与沙盒注入:** 意图解析后分配唯一的变脸名 `asset_name` 和隔离前缀 `Session_ID`，交由 FastAPI 注入到独立的子任务 json 中。
2. **盲执行器 (Pipeline Executor):** 不再将不同功能的图拼接，而是作为一个个独立的微服务节点，独立发给 ComfyUI 计算。
3. **搬运中枢 (IO Mover):** 强制监听 ComfyUI `output` 的产出图，并按约定重命名搬回 `input` 目录完成无缝接力。

前端目录结构

```Plain
frontend/
├── assets/                  # 静态资源
│   ├── images/              # 图标、占位图
│   └── fonts/
├── lib/
│   ├── core/                # 核心通用代码
│   │   ├── constants/       # API 地址、全局常量
│   │   ├── theme/           # 颜色定义 (AppColors.burgundy...), 字体样式
│   │   └── utils/           # 工具函数 (日期格式化等)
│   ├── data/                # 数据层 (负责联网)
│   │   ├── models/          # Dart 实体类 (User, Recipe, ChatMessage)
│   │   ├── providers/       # Riverpod 状态管理 (全局状态)
│   │   └── services/        # API 服务
│   │       ├── api_client.dart   # Dio 封装 (HTTP)
│   │       └── socket_service.dart # WebSocket 封装 (监听生图进度)
│   ├── presentation/        # 表现层 (UI)
│   │   ├── widgets/         # 通用组件
│   │   │   ├── common/      # 按钮、输入框
│   │   │   └── chat/        # 聊天气泡、动态 Widget (滑块、色盘)
│   │   ├── screens/         # 页面
│   │   │   ├── home/        # 首页 (Hero Section)
│   │   │   ├── editor/      # 修图核心页 (你的重点！)
│   │   │   │   ├── editor_screen.dart
│   │   │   │   ├── layers/  # 涂抹层、图片层
│   │   │   │   └── logic/   # 修图页面的特定逻辑
│   │   │   ├── community/   # 社区瀑布流
│   │   │   └── profile/
│   │   └── navigation/      # 底部导航栏逻辑
│   └── main.dart            # App 入口
├── pubspec.yaml
└── analysis_options.yaml
```

# 启动项目

请按照以下顺序配置环境。若仅需与团队一致的后端联调，优先使用上文 **「合作者如何复现」** 中的 Docker 流程。

1. ### 前置要求 (Prerequisites)

确保你的开发环境已安装：

- **Git**: 用于代码版本控制。
- **Python 3.10+**: 后端运行环境。
- **Flutter SDK**: (版本 3.x+) 且已配置环境变量。
- **VS Code**: 推荐 IDE，配合 Flutter 和 Python 插件。
- **(Windows 用户)**: 请确保已开启“开发者模式”以支持 Flutter 插件编译。

1. ### 初始化后端 (Backend)

后端负责处理业务逻辑及与 AI 服务的通信。若需跑通 **依赖 ComfyUI 生图** 的接口（如 Phase 2 管线），再在本机启动 ComfyUI（默认 **8188**）；仅验证 Router / 数据库时可不启动。

打开终端，进入 `backend` 目录：

```Bash
cd backend
```

#### 2.0 使用 Docker Compose 启动后端（推荐）

在项目**仓库根目录**（含 `docker-compose.backend.yml`）执行：

1. **（可选但推荐）** 复制环境变量模板，并填写 LLM 等密钥：

   ```Bash
   cp .env.docker.example .env
   # Windows PowerShell: Copy-Item .env.docker.example .env
   ```

   Compose 会读取**根目录**下的 `.env`，把其中的 `MUSELENS_LLM_*` 等注入后端容器（勿将含密钥的 `.env` 提交到 Git）。

2. 构建并启动：

   ```Bash
   docker compose -f docker-compose.backend.yml up --build
   ```

- **后端 API**：`http://127.0.0.1:8000`（Swagger：`/docs`）；容器内目录 `COMFYUI_*` 默认指向 `/tmp/comfyui/...`，与宿主机 ComfyUI 目录无关。
- **PostgreSQL + pgvector**：镜像 `pgvector/pgvector:pg16`；宿主机端口默认 **5433**，库名 `muselens`，默认口令见 `.env.docker.example` 中的 `MUSELENS_POSTGRES_PASSWORD`（可用环境变量覆盖）。
- **RAG**：容器内已设置 `MUSELENS_RAG_BACKEND=pgvector`，`MUSELENS_PG_DSN` 指向同一 Postgres 服务注册透镜后可同步向量表。
- **宿主机上的 ComfyUI**（例如本机 `8188`）：容器通过 `host.docker.internal:8188` 访问（由 `MUSELENS_COMFY_NETLOC` 控制，Linux 下 compose 已配置 `extra_hosts: host-gateway`）。
- 镜像由 [backend/Dockerfile](backend/Dockerfile) 构建（Python 3.12 + `requirements.txt` + `requirements-dev.txt`）。构建默认使用 **清华 Debian/apt 与 PyPI 镜像**，并启用 **BuildKit 的 pip/apt 缓存**（重复 `docker compose build` 会明显更快）；需要官方 PyPI 时可在根目录 `.env` 中设置 `PIP_INDEX_URL=https://pypi.org/simple` 后再构建。

在**宿主机**跑集成测试并连接 Compose 暴露的 Postgres 时，可在 shell 或本机环境变量中设置（口令与端口须与 compose / 根目录 `.env` 一致），例如：

`MUSELENS_TEST_POSTGRES_DSN=postgresql://postgres:123cfx@127.0.0.1:5433/postgres`

**在 Docker 后端容器里跑 pytest（推荐与线上一致）**：先 `docker compose -f docker-compose.backend.yml up -d --build`，再在仓库根目录执行：

```Bash
docker compose -f docker-compose.backend.yml exec backend python -m pytest tests/ -v
```

仅跑集成测试（`-m integration`）、排除需真实 LLM 的用例时，可先不设 `MUSELENS_TEST_REAL_LLM`。镜像已安装 `requirements-dev.txt`（含 pytest），`MUSELENS_TEST_POSTGRES_DSN` 在 compose 里指向服务名 `postgres`。

本地不用容器时，可使用 Conda（例如 `conda activate Muselens`）进入 `backend` 后执行 `pip install -r requirements.txt` 与 `pip install -r requirements-dev.txt`。运行后端单测请在 **`backend` 目录下**执行：`python -m pytest tests/`，以便正确解析 `app` 包。

#### 2.1 创建并激活虚拟环境

- **Windows:**

```Bash
python -m venv venv
.\venv\Scripts\activate
```

- **Mac / Linux:**

```Bash
python3 -m venv venv
source venv/bin/activate
```

#### 2.2 安装依赖及配置

```Bash
pip install -r requirements.txt
```
> **注意**：你需要去配置好 `COMFYUI_OUTPUT_DIR` 和 `COMFYUI_INPUT_DIR` 二个环境变量让 FastAPI 控制文件搬运。默认代码 (compiler) 中是写死了 `D:\AI\ComfyUI_windows_portable\ComfyUI\`，请自行在代码或系统中修改为你机器上的路径。

#### 2.3 启动后端服务

```Bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
- 服务启动后，请打开浏览器访问：`http://127.0.0.1:8000/docs` 查看 Swagger 接口。

#### 2.4 Phase 2 本地管线连通测试 (纯异步 DAG) 
1. 确保你的 ComfyUI `input` 目录中有一张图片，比如叫 `woman-8463055_1280.jpg`。
2. 在 Swagger 页面 `http://127.0.0.1:8000/docs` 中，找到 `GET /run_pipeline` 接口。
3. 输入图片名称和要处理的 Prompt，点击 Execute 即可验证 A1->A2 本地异步 DAG 编排引擎与拓扑变量绑定 ($step_1.mask_result) 的闭环能力。
4. (可选) 对于前端调试，也可以使用 WebSocket 客户端连接 `ws://127.0.0.1:8000/ws/editor/test` 并发送 `{"action": "generate"}`，测试纯无阻塞的流式进度推流。

1. ### 初始化前端 (Frontend)

保持后端终端运行，**新开一个终端窗口**，进入 `frontend` 目录：

```Bash
cd frontend
```

#### 3.1 安装 Flutter 依赖

拉取 `pubspec.yaml` 中定义的所有包：

```Bash
flutter pub get
```

#### 3.2 配置 API 地址 (关键！)

由于开发环境不同（真机 vs 模拟器），你需要检查 API 地址配置。 打开 `lib/core/constants/api_constants.dart`，根据你的运行方式修改 `baseUrl`：

```Dart
class ApiConstants {
  // 选项 A: Chrome 浏览器 / iOS 模拟器static const String baseUrl = 'http://127.0.0.1:8000';

  // 选项 B: Android 模拟器 (10.0.2.2 映射宿主电脑)// static const String baseUrl = 'http://10.0.2.2:8000';// 选项 C: 真机调试 (请确保手机和电脑在同一 WiFi)// static const String baseUrl = 'http://192.168.x.x:8000';
}
```

#### 3.3 运行 App

```Bash
flutter run
```

推荐优先选择 **Chrome** 或 **Windows** 进行快速 UI 调试。

