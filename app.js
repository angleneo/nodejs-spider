const https = require('https');
const fs = require('fs')
const cheerio = require('cheerio')
let url = 'https://sh.5i5j.com/zufang/pudongxinqu/'

function getHouse (html) {
  if (html) {
    let $ = cheerio.load(html)
    let imgList = []
    let pList = $('.pList')
    pList.find('li').each(function () {
      let img = $(this)
      let src = img.find('.listImg').find('a').find('img').attr('src')
      let title = img.find('.listCon').find('.listTit').find('a').text()
      let type = img.find('.listCon').find('.listX').find('p').eq(0).text()
      let price = img.find('.listCon').find('.listX').find('.jia').find('.redC').find('strong').text()
      imgList.push({
        house_src: src,
        house_title: title,
        house_type: type,
        house_price: price
      })
    })
    return imgList
  } else {
    console.log('信息不存在！')
  }
}

function printHouseInfo (html) {
  fs.writeFile('./house.html', html, function (err) {
    console.log(err)
  })
}


https.get(url, function (res) {
  let html = ''
  res.on('data', function (data) {
    html += data
    console.log(data)
  })
  res.on('end', function () {
    let houseInfo = getHouse(html)
    console.log(houseInfo)
    let house = ''
    for (let i in houseInfo) {
      house += "<ul><li>" + '<img src="' + houseInfo[i].house_src + '">' + houseInfo[i].house_title + '\n' + houseInfo[i].house_type + houseInfo[i].house_price + "</li></ul>"
    }
    printHouseInfo(house)
  })
})