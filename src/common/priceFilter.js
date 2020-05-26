let globalPriceFilter = {
    priceFilter:function(val){
        let data = JSON.parse(val)
        let list = data[0];
        let price = list.price[0]
        let content = ''
        if (list.valuationType == 1) {
            return `${price.countTime}元/小时`
        } else if (list.valuationType == 2) {
            if (list.unit == 1) {
                return `${price.countSettle}元/件`
            } else if (list.unit == 2) {
                return `${price.countDai}元/袋`
            } else if (list.unit == 3) {
                return `${price.countChe}元/车`
            } else {
                return `${price.countDun}元/吨`
            }
        } else if (list.valuationType == 3) {
            let varUnit
            if (list.unit == 1) {
                varUnit = '件'
            } else if (list.unit == 2) {
                varUnit = '袋'
            } else if (list.unit == 3) {
                varUnit = '车'
            } else {
                varUnit = '吨'
            }
            content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
            for (let i in price.ladderObj) {
                if (i > 0 && i != (price.ladderObj.length - 1)) {
                    content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`

                        }
                    }
            content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
            return content
        } else if (list.valuationType == 4) {
            if (price.countSettle) {
                content += `${price.countSettle}元/件,`
            }
            if (price.countDai) {
                content += `${price.countDai}元/袋,`
            }
            if (price.countChe) {
                content += `${price.countChe}元/车,`
            }
            if (price.countDun) {
                content += `${price.countDun}元/吨`
            }
            return content
        } else if (list.valuationType == 5) {
            content += `${price.countTime}元/小时,`
                    if (list.unit == 1) {
                        content += `${price.countSettle}元/件`
                    } else if (list.unit == 2) {
                        content += `${price.countDai}元/袋`
                    } else if (list.unit == 3) {
                        content += `${price.countChe}元/车`
                    } else {
                        content += `${price.countDun}元/吨`
                    }
                    return content
                } else if (list.valuationType == 6) {
                    content += `${price.countTime}元/小时,`
                    let varUnit
                    if (list.unit == 1) {
                        varUnit = '件'
                    } else if (list.unit == 2) {
                        varUnit = '袋'
                    } else if (list.unit == 3) {
                        varUnit = '车'
                    } else {
                        varUnit = '吨'
                    }
                    content += `${(price.ladderObj)[0].count}${varUnit}以下（含），${(price.ladderObj)[0].unit}元/${varUnit}`
                    for (let i in price.ladderObj) {
                        if (i > 0 && i != (price.ladderObj.length - 1)) {
                            content += `；${(Number((price.ladderObj)[i - 1].count)) + 1}至${(price.ladderObj)[i].count}${varUnit}（含），${(price.ladderObj)[i].unit}元/${varUnit}`

                        }
                    }
                    content += `；${(price.ladderObj)[price.ladderObj.length - 2].count}${varUnit}以上，${(price.ladderObj)[price.ladderObj.length - 1].overUnit}元/${varUnit}`
                    return content
                } else if (list.valuationType == 8) {
                    return `${price.countFixed}元/天`
                } else {
                    content += `${price.countTime}元/小时,`
                    if (price.countSettle) {
                        content += `${price.countSettle}元/件,`
                    }
                    if (price.countDai) {
                        content += `${price.countDai}元/袋,`
                    }
                    if (price.countChe) {
                        content += `${price.countChe}元/车,`
                    }
                    if (price.countDun) {
                        content += `${price.countDun}元/吨`
                    }
                    return content
                }
    },
};
    export default {
        install: function(Vue) {
           Object.defineProperty(Vue.prototype, 'GlobalPriceFilter' , { value: globalPriceFilter });
         }	
    }