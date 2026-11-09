### 图像标注的单位

图像标注中 x、y、width 和 height 的单位以整体图像尺寸的百分比形式提供。

请使用以下 `x, y, width, height` 的转换公式：

{% codeblock lang:python %}
pixel_x = x / 100.0 * original_width
pixel_y = y / 100.0 * original_height
pixel_width = width / 100.0 * original_width
pixel_height = height / 100.0 * original_height
{% endcodeblock %}

例如：

{% codeblock lang:python %}
task = {
    "annotations": [{
        "result": [
            {
                "...": "...",

                "original_width": 600,
                "original_height": 403,
                "image_rotation": 0,

                "value": {
                    "x": 5.33,
                    "y": 23.57,
                    "width": 29.16,
                    "height": 31.26,
                    "rotation": 0,
                    "rectanglelabels": [
                        "Airplane"
                    ]
                }
            }
        ]
    }]
}

# 从 LS 百分比单位转换为像素
def convert_from_ls(result):
    if 'original_width' not in result or 'original_height' not in result:
        return None

    value = result['value']
    w, h = result['original_width'], result['original_height']

    if all([key in value for key in ['x', 'y', 'width', 'height']]):
        return w * value['x'] / 100.0, \
               h * value['y'] / 100.0, \
               w * value['width'] / 100.0, \
               h * value['height'] / 100.0

# 从像素转换为 LS 百分比单位
def convert_to_ls(x, y, width, height, original_width, original_height):
    return x / original_width * 100.0, y / original_height * 100.0, \
           width / original_width * 100.0, height / original_height * 100


# 从 LS 转换
output = convert_from_ls(task['annotations'][0]['result'][0])
if output is None:
    raise Exception('Wrong convert') 
pixel_x, pixel_y, pixel_width, pixel_height = output
print(pixel_x, pixel_y, pixel_width, pixel_height)

# 转换回 LS
x, y, width, height = convert_to_ls(pixel_x, pixel_y, pixel_width, pixel_height, 600, 403)
print(x, y, width, height)
{% endcodeblock %}
