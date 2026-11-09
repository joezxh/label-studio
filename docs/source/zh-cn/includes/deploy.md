## 系统要求
你可以在运行 Python 3.6 或更高版本的 Linux、Windows 或 MacOSX 机器上安装 Label Studio。

### 端口要求
Label Studio 默认要求端口 8080 处于开放状态。如需使用其他端口，请在启动 Label Studio 时指定。请参阅[启动 Label Studio](https://labelstud.io/guide/start)。

### 服务器要求
请根据你计划标注的数据量分配磁盘空间。作为基准，使用 SQLite 数据库时，100 万条标注任务在磁盘上大约占用 2.3GB。生产环境实例建议预留 50GB 磁盘空间。

至少使用 **8GB RAM**，但推荐使用 16GB RAM，例如 Amazon AWS 上的 t3.large 或 t3.xlarge。

有关大规模使用 Label Studio 以及标注性能的更多信息，请参阅[启动 Label Studio](https://labelstud.io/guide/start)。

### 软件要求
PostgreSQL 14 或更高版本，或 SQLite 3.35 或更高版本。
