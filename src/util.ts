const dataSet = {
    swufe: '西南财经大学',
    cqu: '重庆大学',
    sciif: 'SCI影响因子-JCR',
    cufe: '中央财经大学',
    nju: '南京大学',
    sci: 'SCI分区-JCR',
    uibe: '对外经济贸易大学',
    xju: '新疆大学',
    ssci: 'SSCI分区-JCR',
    sdufe: '山东财经大学',
    cug: '中国地质大学',
    jci: 'JCI指数-JCR',
    xdu: '西安电子科技大学',
    ccf: '中国计算机学会',
    sciif5: 'SCI五年影响因子-JCR',
    swjtu: '西南交通大学',
    cju: '长江大学（不是计量大学）',
    sciwarn: '中科院预警',
    ruc: '中国人民大学',
    zju: '浙江大学',
    sciBase: 'SCI基础版分区-中科院',
    xmu: '厦门大学',
    zhongguokejihexin: '中国科技核心期刊',
    sciUp: 'SCI升级版分区-中科院',
    sjtu: '上海交通大学',
    fms: 'FMS',
    ajg: 'ABS学术期刊指南',
    fdu: '复旦大学',
    utd24: 'UTD24',
    ft50: 'FT50',
    hhu: '河海大学',
    eii: 'EI检索',
    cscd: '中国科学引文数据库',
    pku: '北大核心',
    cssci: '南大核心',
    ahci: 'A&HCI',
    scu: '四川大学',
}

interface PublicationInfo {
    publicationName: string
    rank: string
}

export function splitDictToList(
    inputDict: Map<string, string>,
): PublicationInfo[] {
    const result: PublicationInfo[] = []
    for (const key in inputDict) {
        if (Object.prototype.hasOwnProperty.call(inputDict, key)) {
            const publicationInfo: PublicationInfo = {
                publicationName: dataSet[key],
                rank: inputDict[key],
            }
            result.push(publicationInfo)
        }
    }
    return result
}
