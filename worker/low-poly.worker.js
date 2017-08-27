import Delaunay from 'delaunay'
import { sobel } from '../lib/sobel'

self.addEventListener('message', function (event) {
  const data = event.data
  const { imgData, width, height, jxdvalue } = data

  var collectors = []
  var particles = []

  sobel(imgData, function (value, x, y) {
    if (value > 40) {
      collectors.push([x, y])
    }
  })

  //          添加一些随机点
  for (var i = 0; i < this.random; i++) {
    particles.push([Math.random() * width, Math.random() * height])
  }
  //          添加随机边缘点，数量为边缘点数量除于50
  const length = ~~(collectors.length / jxdvalue)

  let random
  for (var l = 0; l < length; l++) {
    random = (Math.random() * collectors.length) << 0
    particles.push(collectors[random])
    collectors.splice(random, 1)
  }
  //          添加四顶点坐标
  particles.push([0, 0], [0, height], [width, 0], [width, height])
  //          使用delaunay三角化获取三角坐标
  let triangles = Delaunay.triangulate(particles)
  let x1, x2, x3, y1, y2, y3, cx, cy
  for (let i = 0; i < triangles.length; i += 3) {
    x1 = particles[triangles[i]][0]
    x2 = particles[triangles[i + 1]][0]
    x3 = particles[triangles[i + 2]][0]
    y1 = particles[triangles[i]][1]
    y2 = particles[triangles[i + 1]][1]
    y3 = particles[triangles[i + 2]][1]
    //              获取三角形中心点坐标
    cx = ~~((x1 + x2 + x3) / 3)
    cy = ~~((y1 + y2 + y3) / 3)
    //              获取中心点坐标的颜色值
    var index = (cy * imgData.width + cx) * 4
    var colorr = imgData.data[index]
    var colorg = imgData.data[index + 1]
    var colorb = imgData.data[index + 2]
    //              绘制三角形

    self.postMessage({
      x1, x2, x3, y1, y2, y3, colorr, colorg, colorb
    })
  }

  self.postMessage({
    finish: true
  })
})
