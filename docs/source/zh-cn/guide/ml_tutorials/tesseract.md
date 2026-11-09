---
title: Interactive bounding boxes OCR with Tesseract 
type: guide
tier: all
order: 55
hide_menu: true
hide_frontmatter_title:true
meta_title: Interactive bounding boxes OCR in Label Studio with a Tesseract backend
meta_description: Tutorial for how to use Label Studio and Tesseract to assist with your OCR projects
categories:
    - Computer Vision
    - Optical Character Recognition
    - Tesseract
image: "/guide/ml_tutorials/tesseract.png"
---

# 使用 Tesseract 的交互式边界框 OCR

使用 OCR 引擎进行交互式 ML 辅助标注，加快布局检测、分类和识别模型的标注速度。

Tesseract 用于 OCR，但连接其他 OCR 引擎或模型只需进行最小的调整。

已在 Label Studio 1.10.1 上测试，对 Label Studio 本地文件存储和 S3 兼容存储（以 MinIO 作为示例数据存储）提供基本支持。

## 开始之前

在开始之前：
* 确保已安装 git
* 确保已安装 Docker Compose。对于 MacOS 和 Windows 用户，我们建议使用 Docker Desktop。

你还必须安装 [Label Studio ML 后端](https://github.com/HumanSignal/label-studio-ml-backend?tab=readme-ov-file#quickstart)。

本教程使用 [`tesseract` 示例](https://github.com/HumanSignal/label-studio-ml-backend/tree/master/label_studio_ml/examples/tesseract)。

### 1. 安装 Label Studio

启动 Label Studio。你可以按照 [官方文档](https://labelstud.io/guide/install.html) 中的指南操作，或使用以下命令：

   ```
   docker run -it \
      -p 8080:8080 \
      -v `pwd`/mydata:/label-studio/data \
      heartexlabs/label-studio:latest
   ```

   可选地，你可以在 Label Studio 中启用本地文件服务

   ```
   docker run -it \
      -p 8080:8080 \
      -v `pwd`/mydata:/label-studio/data \
      --env LABEL_STUDIO_LOCAL_FILES_SERVING_ENABLED=true \
      --env LABEL_STUDIO_LOCAL_FILES_DOCUMENT_ROOT=/label-studio/data/images \
      heartexlabs/label-studio:latest
   ```
   如果你正在使用本地文件服务，请务必从 Label Studio [获取 API 令牌的副本](https://labelstud.io/guide/user_account#Access-token) 以连接模型。

### 2. 创建一个 Label Studio 项目

为 Tesseract OCR 创建一个新项目。在项目的 **设置（Settings）** 中设置 **标注界面（Labeling Interface）**。

   填写以下模板代码。在 `RectangleLabels` 中指定 `smart="true"` 非常重要。
   ```
   <View>    
      <Image name="image" value="$ocr" zoom="true" zoomControl="false"
            rotateControl="true" width="100%" height="100%"
            maxHeight="auto" maxWidth="auto"/>
      
      <RectangleLabels name="bbox" toName="image" strokeWidth="1" smart="true">
         <Label value="Label1" background="green"/>
         <Label value="Label2" background="blue"/>
         <Label value="Label3" background="red"/>
      </RectangleLabels>

      <TextArea name="transcription" toName="image" 
      editable="true" perRegion="true" required="false" 
      maxSubmissions="1" rows="5" placeholder="Recognized Text" 
      displayMode="region-list"/>
   </View>
   ```

### 3. 安装 Tesseract OCR

下载 Label Studio 机器学习后端仓库。
   ```
   git clone https://github.com/humansignal/label-studio-ml-backend
   cd label-studio-ml-backend/label_studio_ml/examples/tesseract
   ```

在 `example.env` 文件中配置参数：

   ```
   LABEL_STUDIO_HOST=http://host.docker.internal:8080
   LABEL_STUDIO_ACCESS_TOKEN=<用于本地文件访问的可选令牌>

   AWS_ACCESS_KEY_ID=<为 minio 示例设置为 MINIO_ROOT_USER>
   AWS_SECRET_ACCESS_KEY=<为 minio 示例设置为 MINIO_ROOT_PASSWORD>
   AWS_ENDPOINT=http://host.docker.internal:9000

   MINIO_ROOT_USER=<用户名>
   MINIO_ROOT_PASSWORD=<密码>
   MINIO_API_CORS_ALLOW_ORIGIN=*
   ```

根据你的数据摄取方法，可能有几种配置：

**本地文件存储**

如果你选择使用 Label Studio 本地文件存储，请务必设置 `LABEL_STUDIO_HOST` 和 `LABEL_STUDIO_ACCESS_TOKEN` 变量。

**S3 兼容存储（MinIO 或 AWS S3）**

通过编辑 `MINIO_ROOT_USER` 和 `MINIO_ROOT_PASSWORD` 变量来配置后端和 MinIO 服务器，并使 `AWS_ACCESS_KEY_ID` 和 `AWS_SECRET_ACCESS_KEY` 变量等于这些值。你可以选择通过设置这些变量来连接到你自己的 AWS 云存储。请注意，你可能需要对 `tesseract.py` 文件进行额外的软件更改，以匹配你的特定基础架构配置。

> 注意：如果你使用此方法，请从 `example.env` 文件中删除 `LABEL_STUDIO_ACCESS_TOKEN` 或将其留空。

**其他远程存储**

如果你在任何其他具有 `http` 或 `https` 访问权限的公共存储上托管你的图像，请不要更改默认的 `example.env` 文件。

### 4. 启动 Tesseract 和 MinIO 服务器

   ```
   docker compose up
   ```

### 5. 上传任务

   如果你使用的是 Label Studio 本地文件存储选项，请直接使用 Label Studio 界面将图像上传到 Label Studio。

   如果你使用 MinIO 进行任务存储，请登录 `http://localhost:9001` 的 MinIO 控制面板。创建一个新存储桶，记下名称，并将你的任务上传到 MinIO。

   将任务的可见性设置为公开。
   对你的云存储进行进一步配置超出了本教程的范围，你将需要根据你的特定需求配置你的存储。

如果使用 MinIO，请转到项目设置中的 [**云存储** 页面](https://labelstud.io/guide/project_settings#Cloud-storage)。

   通过连接到 S3 端点 `http://host.docker.internal:9000` 来添加你的源 S3 存储，使用上一步中的存储桶名称，以及上一步中配置的访问密钥 ID 和私有访问密钥。对于 MinIO 示例，取消勾选 **使用预签名 URL（Use pre-signed URLS）**。检查连接并保存存储。

### 6. 在项目设置中添加模型

从项目设置中，选择 **模型（Model）** 页面并点击 [**连接模型（Connect Model）**](https://labelstud.io/guide/ml#Connect-the-model-to-Label-Studio)。

   添加 URL `http://host.docker.internal:9090` 并将模型保存为 ML 后端。

### 7. 在交互模式下标注

要使用此功能，请启用 **自动标注（Auto-Annotation）** 并使用 `Autodetect`（自动检测）矩形来绘制框

示例如下：

![ls_demo_ocr](https://user-images.githubusercontent.com/17755198/165186574-05f0236f-a5f2-4179-ac90-ef11123927bc.gif)

参考链接：
- https://labelstud.io/blog/improve-ocr-quality-for-receipt-processing-with-tesseract-and-label-studio
- https://labelstud.io/blog/release-130.html
