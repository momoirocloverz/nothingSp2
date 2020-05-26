let priceFormat = (val) => {
  let salary = JSON.parse(val)
  // settlementType 1:日结 2:月 4:周 3:实时
  // sex 1:男  2:女
  let salaryMale = ''
  let salaryFemale = ''
  let salaryType = ''
  for (let i in salary) {
    if (salary[i].settlementType == 1) {
      for (let j in salary[i].price) {
        if (((salary[i].price)[j]).sex == 1) {
          let item = (salary[i].price)[j]
          salaryMale = ''

          if (salary[i].valuationType == 1) {
            salaryType = '计时'
            salaryMale = `${item.countTime}元/小时`
          } else if (salary[i].valuationType == 2) {
            salaryType = '单一固定计量'
            if (salary[i].unit == 1) {
              salaryMale = `${item.countSettle}元/件`
            } else if (salary[i].unit == 2) {
              salaryMale = `${item.countDai}元/袋`
            } else if (salary[i].unit == 3) {
              salaryMale = `${item.countChe}元/车`
            } else {
              salaryMale = `${item.countDun}元/吨`
            }
          } else if (salary[i].valuationType == 3) {
            salaryType = '单一阶梯计量'
            let varUnit
            if (salary[i].unit == 1) {
              varUnit = '件'
            } else if (salary[i].unit == 2) {
              varUnit = '袋'
            } else if (salary[i].unit == 3) {
              varUnit = '车'
            } else {
              varUnit = '吨'
            }
            salaryMale += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
            for (let z in item.ladderObj) {
              if (z > 0 && z != (item.ladderObj.length - 1)) {
                salaryMale += `；${(Number((item.ladderObj)[z-1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`
              }
            }
            salaryMale += `；${(item.ladderObj)[item.ladderObj.length-2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length-1].overUnit}元/${varUnit}`
          } else if (salary[i].valuationType == 4) {
            salaryType = '组合计量'
            if (item.countSettle) {
              salaryMale += `${item.countSettle}元/件,`
            }
            if (item.countDai) {
              salaryMale += `${item.countDai}元/袋,`
            }
            if (item.countChe) {
              salaryMale += `${item.countChe}元/车,`
            }
            if (item.countDun) {
              salaryMale += `${item.countDun}元/吨`
            }
          } else if (salary[i].valuationType == 5) {
            salaryType = '计时+固定计量'
            if (salary[i].unit == 1) {
              salaryMale += `${item.countSettle}元/件，`
            } else if (salary[i].unit == 2) {
              salaryMale += `${item.countDai}元/袋，`
            } else if (salary[i].unit == 3) {
              salaryMale += `${item.countChe}元/车，`
            } else {
              salaryMale += `${item.countDun}元/吨，`
            }
            salaryMale += `${item.countTime}元/小时`
          } else if (salary[i].valuationType == 6) {
            salaryType = '计时+阶梯计量'
            salaryMale += `${item.countTime}元/小时,`
            let varUnit
            if (salary[i].unit == 1) {
              varUnit = '件'
            } else if (salary[i].unit == 2) {
              varUnit = '袋'
            } else if (salary[i].unit == 3) {
              varUnit = '车'
            } else {
              varUnit = '吨'
            }
            salaryMale += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
            for (let z in item.ladderObj) {
              if (z > 0 && z != (item.ladderObj.length - 1)) {
                salaryMale += `；${(Number((item.ladderObj)[z-1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`
              }
            }
            salaryMale += `；${(item.ladderObj)[item.ladderObj.length-2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length-1].overUnit}元/${varUnit}`
          } else if (salary[i].valuationType == 8) {
            salaryType = '日固定'
            salaryMale += `${item.countFixed}元/天,`
          } else {
            salaryType = '计时+组合计量'
            if (item.countSettle) {
              salaryMale += `${item.countSettle}元/件,`
            }
            if (item.countDai) {
              salaryMale += `${item.countDai}元/袋,`
            }
            if (item.countChe) {
              salaryMale += `${item.countChe}元/车,`
            }
            if (item.countDun) {
              salaryMale += `${item.countDun}元/吨,`
            }
            salaryMale += `${item.countTime}元/小时`
          }
        } else {
          let item = (salary[i].price)[j]
          salaryFemale = ''
          if (salary[i].valuationType == 1) {
            salaryFemale = `${item.countTime}元/小时`
          } else if (salary[i].valuationType == 2) {
            if (salary[i].unit == 1) {
              salaryFemale = `${item.countSettle}元/件`
            } else if (salary[i].unit == 2) {
              salaryFemale = `${item.countDai}元/袋`
            } else if (salary[i].unit == 3) {
              salaryFemale = `${item.countChe}元/车`
            } else {
              salaryFemale = `${item.countDun}元/吨`
            }
          } else if (salary[i].valuationType == 3) {
            let varUnit
            if (salary[i].unit == 1) {
              varUnit = '件'
            } else if (salary[i].unit == 2) {
              varUnit = '袋'
            } else if (salary[i].unit == 3) {
              varUnit = '车'
            } else {
              varUnit = '吨'
            }
            salaryFemale += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
            for (let z in item.ladderObj) {
              if (z > 0 && z != (item.ladderObj.length - 1)) {
                salaryFemale += `；${(Number((item.ladderObj)[z-1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`
              }
            }
            salaryFemale += `；${(item.ladderObj)[item.ladderObj.length-2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length-1].overUnit}元/${varUnit}`
          } else if (salary[i].valuationType == 4) {
            if (item.countSettle) {
              salaryFemale += `${item.countSettle}元/件,`
            }
            if (item.countDai) {
              salaryFemale += `${item.countDai}元/袋,`
            }
            if (item.countChe) {
              salaryFemale += `${item.countChe}元/车,`
            }
            if (item.countDun) {
              salaryFemale += `${item.countDun}元/吨`
            }
          } else if (salary[i].valuationType == 5) {
            if (salary[i].unit == 1) {
              salaryFemale += `${item.countSettle}元/件，`
            } else if (salary[i].unit == 2) {
              salaryFemale += `${item.countDai}元/袋，`
            } else if (salary[i].unit == 3) {
              salaryFemale += `${item.countChe}元/车，`
            } else {
              salaryFemale += `${item.countDun}元/吨，`
            }
            salaryFemale += `${item.countTime}元/小时`
          } else if (salary[i].valuationType == 6) {
            salaryFemale += `${item.countTime}元/小时,`
            let varUnit
            if (salary[i].unit == 1) {
              varUnit = '件'
            } else if (salary[i].unit == 2) {
              varUnit = '袋'
            } else if (salary[i].unit == 3) {
              varUnit = '车'
            } else {
              varUnit = '吨'
            }
            salaryFemale += `${(item.ladderObj)[0].count}${varUnit}以下（含），${(item.ladderObj)[0].unit}元/${varUnit}`
            for (let z in item.ladderObj) {
              if (z > 0 && z != (item.ladderObj.length - 1)) {
                salaryFemale += `；${(Number((item.ladderObj)[z-1].count)) + 1}至${(item.ladderObj)[z].count}${varUnit}（含），${(item.ladderObj)[z].unit}元/${varUnit}`
              }
            }
            salaryFemale += `；${(item.ladderObj)[item.ladderObj.length-2].count}${varUnit}以上，${(item.ladderObj)[item.ladderObj.length-1].overUnit}元/${varUnit}`
          } else if (salary[i].valuationType == 8) {
            salaryType = '日固定'
            salaryFemale += `${item.countFixed}元/天,`
          } else {

            if (item.countSettle) {
              salaryFemale += `${item.countSettle}元/件,`
            }
            if (item.countDai) {
              salaryFemale += `${item.countDai}元/袋,`
            }
            if (item.countChe) {
              salaryFemale += `${item.countChe}元/车,`
            }
            if (item.countDun) {
              salaryFemale += `${item.countDun}元/吨,`
            }
            salaryFemale += `${item.countTime}元/小时`
          }
        }
      }
    }
  }
  return {
    salaryType,
    salaryMale,
    salaryFemale
  }
}

export default priceFormat