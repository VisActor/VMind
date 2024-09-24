/* eslint-disable max-len */
import type { DataExtractionCase } from '@src/pages/DataExtraction/type';

const economyData = {
  domain: 'economy',
  data: [
    {
      isEnglish: false,
      dataTable: [
        {
          日期: '9月20日开盘',
          汇率类型: '即期汇率',
          汇率: 7.06,
          较前一交易日升值: null,
          单日涨幅: null
        },
        {
          日期: '9月20日收盘',
          汇率类型: '即期汇率',
          汇率: 7.0644,
          较前一交易日升值: 339,
          单日涨幅: null
        },
        {
          日期: '9月20日',
          汇率类型: '离岸汇率',
          汇率: 7.0556,
          单日涨幅: null
        },
        {
          日期: '9月19日',
          汇率类型: '即期汇率',
          汇率: null,
          较前一交易日升值: null,
          单日涨幅: 0.33
        },
        {
          日期: '9月19日',
          汇率类型: '离岸汇率',
          汇率: null,
          较前一交易日升值: null,
          单日涨幅: 0.34
        }
      ],
      fieldInfo: [
        {
          fieldName: '日期',
          description: '具体日期',
          fieldType: 'date',
          dateGranularity: 'day',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '汇率类型',
          description: '汇率的类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '汇率',
          description: '人民币对美元的汇率',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '较前一交易日升值',
          description: '较前一交易日升值的基点数',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '单日涨幅',
          description: '单日涨幅百分比',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '9月20日，人民币对美元即期汇率开盘报7.0600，随后升破这一关口至7.0527，较前一交易日升值超百点，续创2023年5月底以来的新高。在前一交易日即期汇率大涨的带动下，9月20日，人民币对美元中间价报7.0644，上涨339个基点，创下2023年5月29日以来新高。离岸市场上，人民币对美元汇率9月20日同样升破7.06关口，截至发稿，最高至7.0556，较前一交易日升值同样超百点。在美联储4年首次降息的影响下，人民币对美元汇率9月19日迎来大涨，人民币对美元即期汇率和离岸人民币对美元汇率单日分别上涨0.33%和0.34%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          市场: '亚洲市场',
          指数: '日经指数',
          涨幅: 2.13
        },
        {
          市场: null,
          指数: '澳大利亚指数',
          涨幅: 0.63
        },
        {
          市场: 'A股',
          指数: '沪综指',
          涨幅: 0.69
        },
        {
          市场: 'A股',
          指数: '深成指',
          涨幅: 1.19
        },
        {
          市场: 'H股',
          指数: '恒生指数',
          涨幅: 2
        },
        {
          市场: 'H股',
          指数: '恒生科技指数',
          涨幅: 3.25
        },
        {
          市场: 'H股',
          个股: '富力地产',
          涨幅: 12
        }
      ],
      fieldInfo: [
        {
          fieldName: '市场',
          description: '市场名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '指数',
          description: '指数名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '个股',
          description: '指数名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '涨幅',
          description: '指数涨幅',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '美联储降息之后，全球金融资产“撒欢”，9月19日亚洲市场开盘狂欢，日本股市高开高走，日经指数全日上涨2.13%，澳大利亚指数上涨0.63%。\n\nA股和H股当日也放量上涨。其中，沪综指全日上行0.69%，深成指涨1.19%，全市场4800只个股上扬，有60只个股当日涨停，两市成交额达到6270亿元，较上个交易日放量1477亿元。H股的表现更为强劲，9月19日恒生指数的涨幅达到2%，恒生科技指数大涨3.25%。内房股集体高涨，富力地产涨超12%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          收益率优势: 5,
          比较资产: '美债'
        },
        {
          收益率优势: 8,
          比较资产: '标普500指数'
        },
        {
          收益率优势: 18,
          比较资产: '铜'
        },
        {
          收益率优势: 33,
          比较资产: '原油'
        }
      ],
      fieldInfo: [
        {
          fieldName: '收益率优势',
          description: '黄金收益率相对于其他资产的优势',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '比较资产',
          description: '与黄金收益率比较的资产',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        }
      ],
      text: '银河证券分析师华立认为，黄金是美国经济衰退时期理想的资产配置选择，胜率与收益率比较优势显著：复盘1973年以来的七次美国经济衰退，黄金在衰退期间相对于其他有色金属大宗商品或其他资产，均具有明显的胜率与收益率优势。其收益率中位数达6%，分别高出美债、标普500指数、铜、原油，5个百分点、8个百分点、18个百分点、33个百分点，胜率也高达71%，除去1980年和1990年的两次衰退以外（历史背景分别对应美联储激进加息和经济温和衰退），黄金的表现均跑赢了美股标普500指数。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          银行名称: '宁波银行',
          资产规模: 30337.44
        },
        {
          银行名称: '杭州银行',
          资产规模: 19848.14
        },
        {
          银行名称: '温州银行',
          资产规模: 4971.18
        },
        {
          银行名称: '泰隆商行',
          资产规模: 4282.68
        },
        {
          银行名称: '台州银行',
          资产规模: 4035.86
        },
        {
          银行名称: '稠州商行',
          资产规模: 3214.51
        },
        {
          银行名称: '民泰商行',
          资产规模: 2890.47
        },
        {
          银行名称: '绍兴银行',
          资产规模: 2581.96
        },
        {
          银行名称: '嘉兴银行',
          资产规模: 1791.3
        },
        {
          银行名称: '宁波通商银行',
          资产规模: 1704.43
        },
        {
          银行名称: '湖州银行',
          资产规模: 1522.2
        },
        {
          银行名称: '金华银行',
          资产规模: 1101.57
        }
      ],
      fieldInfo: [
        {
          fieldName: '银行名称',
          description: '银行的名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '资产规模',
          description: '银行的资产规模',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '截至2024年6月末，全国范围内资产规模上万亿元的城商行共有8家银行，浙江省（宁波银行、杭州银行）占据了两个席位。具体看，“老大哥”宁波银行以30337.44亿元的资产规模，远超其他省内城商行。杭州银行紧随其后，总资产为19848.14亿元。这两家银行资产规模合计50185.58亿元，占全省城商行资产规模的64.11%，超过半壁江山。\n\n相比于第一梯队，第二梯队资产规模出现“断崖式”下降。截至2024年6月末，温州银行、泰隆商行、台州银行的资产规模分别为4,971.18亿元、4,282.68亿元、4,035.86亿元。第三梯队中稠州商行、民泰商行、绍兴银行的资产规模为3,214.51亿元、2,890.47亿元、2,581.96亿元。\n\n另外，有四家银行总资产在2000亿元以下，且差距较小。其中，嘉兴银行资产规模为1,791.30亿元、宁波通商银行、湖州银行、金华银行为1,704.43亿元、1,522.20亿元、1,101.57亿元。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          银行: '温州银行',
          增速: 18.25,
          初始金额: 4203.91,
          最终金额: 4971.18
        },
        {
          银行: '宁波银行',
          增速: 16.67,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '湖州银行',
          增速: 16.29,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '杭州银行',
          增速: 10,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '嘉兴银行',
          增速: 10,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '民泰商行',
          增速: 10,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '绍兴银行',
          增速: 10,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '宁波通商银行',
          增速: 10,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '泰隆商行',
          增速: 5.09,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '金华银行',
          增速: 4.64,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '稠州商行',
          增速: 3.6,
          初始金额: null,
          最终金额: null
        },
        {
          银行: '台州银行',
          增速: 2.03,
          初始金额: null,
          最终金额: null
        }
      ],
      fieldInfo: [
        {
          fieldName: '银行',
          description: '银行名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '增速',
          description: '银行的同比增速',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '初始金额',
          description: '初始金额',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '最终金额',
          description: '最终金额',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '其中，温州银行增速最高，由4203.91亿元增长至4971.18亿元，同比增幅达18.25%。宁波银行、湖州银行增速保持在15%以上，同比增速分别增长16.67%、16.29%。\n\n此外，杭州银行、嘉兴银行、民泰商行、绍兴银行、宁波通商银行等5家银行增速均在10%以上。另有4家银行增速不足5%，分别是泰隆商行（5.09%）、金华银行（4.64%）、稠州商行（3.6%）、台州银行（2.03%）。 '
    },
    {
      isEnglish: false,
      dataTable: [
        {
          银行: '温州银行',
          不良率: 0.97,
          同比变化: -0.18
        },
        {
          银行: '嘉兴银行',
          不良率: 0.88,
          同比变化: null
        },
        {
          银行: '宁波银行',
          不良率: 0.76,
          同比变化: 0
        },
        {
          银行: '杭州银行',
          不良率: 0.76,
          同比变化: 0
        }
      ],
      fieldInfo: [
        {
          fieldName: '银行',
          description: '银行名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '不良率',
          description: '银行的不良贷款率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '不良率的同比变化',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '浙江省内的13家城商行中，只有温州银行、嘉兴银行、宁波银行、杭州银行披露了不良率情况，分别是0.97%、0.88%、0.76%、0.76%，整体表现优异。同比观察，宁波银行、杭州银行不良率持平，温州银行同比下降0.18个百分点。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          时间范围: '2023年6月至12月',
          信托类型: '信托行业',
          成立个数: 30415,
          成立规模: 433250.5,
          规模占比: null
        },
        {
          时间范围: '2023年6月至12月',
          信托类型: '资产服务信托',
          成立个数: 19046,
          成立规模: 247084.1,
          规模占比: 57.03
        },
        {
          时间范围: '2023年6月至12月',
          信托类型: '资产管理信托',
          成立个数: 10862,
          成立规模: 184167.6,
          规模占比: 42.51
        }
      ],
      fieldInfo: [
        {
          fieldName: '时间范围',
          description: '数据对应的时间范围',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '信托类型',
          description: '信托产品的类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '成立个数',
          description: '信托产品的成立个数',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '成立规模',
          description: '信托产品的成立规模',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '规模占比',
          description: '信托产品的规模占比',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '中国信托登记有限公司副总裁刘铁峰曾介绍，根据中国信托登记公司的信托产品登记数据显示，2023年6月至12月，信托行业共成立信托产品30415个，成立规模为43325.05亿元。其中，资产服务信托新成立19046个信托产品，成立规模为24708.41亿元，规模占比57.03%；资产管理信托新成立10862个信托产品，成立规模为18416.76亿元，规模占比42.51%。从成立个数上看，资产服务信托较资产管理信托高75.34%；从成立规模上看，资产服务信托较资产管理信托高34.16%。资产服务信托的成立笔数及规模均大幅度超过了资产管理信托。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          月份: '2月',
          LPR期限: '5年期以上',
          基点变化: -25,
          调整后LPR: 3.95
        },
        {
          月份: '7月',
          LPR期限: '5年期',
          基点变化: -10,
          调整后LPR: null
        }
      ],
      fieldInfo: [
        {
          fieldName: '月份',
          description: '具体月份',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: 'LPR期限',
          description: '贷款市场报价利率的期限',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '基点变化',
          description: 'LPR基点变化',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '调整后LPR',
          description: '调整后的LPR值',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '事实上，自今年以来，我国央行已降息2次。一次是2月份，5年期以上LPR大幅下调25个基点至3.95%；另一次是7月份，5年期LPR再次下调10个基点，LPR进入历史低位。当前仍处于7月降息后的政策效果观察期，短期调降的迫切性不大。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          时间: '当前',
          国债收益率: 3.65,
          备注: '鲍威尔新闻发布会前'
        },
        {
          时间: '当前',
          国债收益率: 3.7,
          备注: '鲍威尔新闻发布会后'
        },
        {
          时间: '4月',
          国债收益率: 4.65,
          备注: null
        },
        {
          时间: '去年10月',
          国债收益率: 5,
          备注: null
        }
      ],
      fieldInfo: [
        {
          fieldName: '时间',
          description: '数据对应的时间',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '国债收益率',
          description: '10年期国债收益率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '备注',
          description: '相关备注信息',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        }
      ],
      text: '这主要体现在10年期国债收益率，已经下降到3.65%（鲍威尔新闻发布会后最终上升至3.70%），比4月下降了整整一个百分点，而去年10月则为更高的5%；而10年期国债收益率极大影响抵押贷款利率。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          存款期限: '1个月',
          利率调整前: 5.05,
          利率调整后: 4.95,
          基点变化: -10
        },
        {
          存款期限: '3个月',
          利率调整前: 4.95,
          利率调整后: 4.85,
          基点变化: -10
        },
        {
          存款期限: '6个月',
          利率调整前: 4.8,
          利率调整后: 4.7,
          基点变化: -10
        },
        {
          存款期限: '1年',
          利率调整前: 4.9,
          利率调整后: 4.5,
          基点变化: -40
        }
      ],
      fieldInfo: [
        {
          fieldName: '存款期限',
          description: '存款的期限',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '利率调整前',
          description: '调整前的利率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '利率调整后',
          description: '调整后的利率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '基点变化',
          description: '利率变化的基点数',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '该行8月已进行一波美元存款利率调降，1万美元的起存额度，1个月期限利率从5.05%下调至4.95%，3个月期限利率从4.95%下调至4.85%，6个月期限也下调10个基点到4.70%，一年期的已降到4.5%左右，较7月份下降了大约40个基点.'
    }
  ]
};

const technologyData = {
  domain: 'technology',
  data: [
    {
      isEnglish: false,
      text: '如图，今年的iPhone 16系列在屏幕尺寸上将分为6.3英寸和6.9英寸两个版本，不过120Hz的配置和全天候显示功能仍然只有Pro机型可以享受。此外，灵动岛和超瓷晶面板均为标配。性能方面，iPhone 16 Pro系列搭载A18 Pro芯片，另外两款则为A18。不过，两款芯片应该都能为AI功能提供助力。影像方面，四款新iPhone标配1200万像素自拍镜头。后置方面，iPhone 16和iPhone 16 Plus均为双摄，Pro系列则为三摄，多出一个1200万像素的潜望长焦镜头。然后是续航，两款屏幕较小的新iPhone，电池容量在3500mAh左右。而iPhone 16 Pro Max的电池最大，来到了4650mAh。充电方面也做了分级，Pro系列支持40W有线快充，另外两款则为27W。售价方面，iPhone 16起售价为5999元，对应128GB版本；iPhone 16 Plus同样的版本则贵了1000元；iPhone 16 Pro和iPhone 16 Pro Max的起售价分别为7999元和9999元，最高来到了13999元。',
      dataTable: [
        {
          型号: 'iPhone 16',
          屏幕尺寸: 6.3,
          芯片: 'A18',
          自拍镜头像素: 1200,
          后置摄像头数量: 2,
          潜望长焦镜头: '否',
          电池容量: 3500,
          有线快充: 27,
          起售价: 5999
        },
        {
          型号: 'iPhone 16 Plus',
          屏幕尺寸: 6.9,
          芯片: 'A18',
          自拍镜头像素: 1200,
          后置摄像头数量: 2,
          潜望长焦镜头: '否',
          电池容量: 3500,
          有线快充: 27,
          起售价: 6999
        },
        {
          型号: 'iPhone 16 Pro',
          屏幕尺寸: 6.3,
          芯片: 'A18 Pro',
          自拍镜头像素: 1200,
          后置摄像头数量: 3,
          潜望长焦镜头: '是',
          电池容量: null,
          有线快充: 40,
          起售价: 7999
        },
        {
          型号: 'iPhone 16 Pro Max',
          屏幕尺寸: 6.9,
          芯片: 'A18 Pro',
          自拍镜头像素: 1200,
          后置摄像头数量: 3,
          潜望长焦镜头: '是',
          电池容量: 4650,
          有线快充: 40,
          起售价: 9999
        }
      ],
      fieldInfo: [
        {
          fieldName: '型号',
          description: '手机型号',
          fieldType: 'string'
        },
        {
          fieldName: '起售价',
          description: '手机起售价',
          fieldType: 'numerical'
        },
        {
          fieldName: '屏幕尺寸',
          description: '手机屏幕尺寸',
          fieldType: 'numerical'
        },
        {
          fieldName: '芯片',
          description: '手机芯片配置',
          fieldType: 'string'
        },
        {
          fieldName: '电池容量',
          description: '手机电池容量的大小',
          fieldType: 'numerical'
        },
        {
          fieldName: '有线快充',
          description: '手机快充瓦数',
          fieldType: 'numerical'
        },
        {
          fieldName: '自拍镜头像素',
          description: '手机自拍镜头像素',
          fieldType: 'numerical'
        },
        {
          fieldName: '后置摄像头数量',
          description: '后置摄像头数量',
          fieldType: 'numerical'
        }
      ]
    },
    {
      isEnglish: false,
      text: '我国科学论文取得丰硕成果，已经成为全球知识创新的重要贡献者。2021年，国际三大检索工具《科学引文索引（SCI）》《工程索引（EI）》和《科技会议录索引（CPCI）》分别收录我国科研论文61.2万篇、36.8万篇和3万篇，数量分别位居世界第1、第1和第2位。科技论文质量大幅提升，2022年我国科技论文被引用次数排名世界第2位[6]。我国专利等知识产权产出量质齐升。2023年，我国发明专利授权数92.1万件，占全部专利授权数的25.2%，比2012年提高7.9个百分点。截至2023年年底，我国境内发明专利有效量达到401.5万件，成为世界上首个有效发明专利数量突破400万件的国家。2023年末我国每万人口高价值发明专利拥有量达到11.8件，较2020年末提高5.5件。',
      dataTable: [
        {
          年份: '2021',
          检索工具: 'SCI',
          论文数量: 612000,
          世界排名: 1,
          发明专利授权数: null,
          发明专利授权占比: null,
          发明专利授权数增长: null,
          境内发明专利有效量: null,
          每万人口高价值发明专利拥有量: null
        },
        {
          年份: '2021',
          检索工具: 'EI',
          论文数量: 368000,
          世界排名: 1,
          发明专利授权数: null,
          发明专利授权占比: null,
          发明专利授权数增长: null,
          境内发明专利有效量: null,
          每万人口高价值发明专利拥有量: null
        },
        {
          年份: '2021',
          检索工具: 'CPCI',
          论文数量: 30000,
          世界排名: 2,
          发明专利授权数: null,
          发明专利授权占比: null,
          发明专利授权数增长: null,
          境内发明专利有效量: null,
          每万人口高价值发明专利拥有量: null
        },
        {
          年份: '2012',
          检索工具: null,
          论文数量: null,
          世界排名: null,
          发明专利授权数: null,
          发明专利授权占比: 17.3,
          发明专利授权数增长: null,
          境内发明专利有效量: null,
          每万人口高价值发明专利拥有量: null
        },
        {
          年份: '2020',
          检索工具: null,
          论文数量: null,
          世界排名: null,
          发明专利授权数: null,
          发明专利授权占比: null,
          发明专利授权数增长: null,
          境内发明专利有效量: null,
          每万人口高价值发明专利拥有量: 6.3
        },
        {
          年份: '2023',
          检索工具: null,
          论文数量: null,
          世界排名: null,
          发明专利授权数: 921000,
          发明专利授权占比: 25.2,
          发明专利授权数增长: 7.9,
          境内发明专利有效量: 4015000,
          每万人口高价值发明专利拥有量: 11.8
        }
      ],
      fieldInfo: [
        {
          fieldName: '年份',
          description: '年份',
          fieldType: 'date',
          dateGranularity: 'year'
        },
        {
          fieldName: '论文数量',
          description: '收录的科研论文数量',
          fieldType: 'numerical'
        },
        {
          fieldName: '检索工具',
          description: '科研论文检索工具',
          fieldType: 'string'
        },
        {
          fieldName: '世界排名',
          description: '科研论文数量排名',
          fieldType: 'numerical'
        },
        {
          fieldName: '发明专利授权数',
          description: '发明专利授权数',
          fieldType: 'numerical'
        },
        {
          fieldName: '发明专利授权占比',
          description: '发明专利授权占比',
          fieldType: 'ratio'
        },
        {
          fieldName: '境内发明专利有效量',
          description: '境内发明专利有效量',
          fieldType: 'numerical'
        },
        {
          fieldName: '每万人口高价值发明专利拥有量',
          description: '每万人口高价值发明专利拥有量',
          fieldType: 'numerical'
        }
      ]
    },
    {
      isEnglish: false,
      text: '受数据源更新的影响，记者主要以8月数据为基础，分析国产C级车市场的现状。8月，国产C级车的累计销量为92398辆，环比上个月上涨29.01%。其中，燃油车和新能源车的销量之和分别为31112辆、61286辆，在C级车总销量中的占比分别为33.67%、66.33%。',
      dataTable: [
        {
          累计销量: 92398,
          环比增长率: 29.01,
          类别: '燃油车',
          销量: 31112,
          占比: 33.67
        },
        {
          累计销量: 92398,
          环比增长率: 29.01,
          类别: '新能源车',
          销量: 61286,
          占比: 66.33
        }
      ],
      fieldInfo: [
        {
          fieldName: '累计销量',
          description: '国产C级车的累计销量',
          fieldType: 'numerical'
        },
        {
          fieldName: '环比增长率',
          description: '环比上个月的增长率',
          fieldType: 'ratio'
        },
        {
          fieldName: '类别',
          description: '车型类别',
          fieldType: 'string'
        },
        {
          fieldName: '销量',
          description: '具体车型的销量',
          fieldType: 'numerical'
        },
        {
          fieldName: '占比',
          description: '具体车型在总销量中的占比',
          fieldType: 'ratio'
        }
      ]
    },
    {
      isEnglish: false,
      text: '奥迪A6L重新将C级车市场的月度销量冠军，从奔驰E级的手中夺回。数据显现，8月，奥迪A6L和奔驰E级的销量分别为12515辆、8700辆；今年前8个月的累计销量分别为127326辆、86844辆。奥迪A6L重新将C级车市场的月度销量冠军，从奔驰E级的手中夺回。数据显现，8月，奥迪A6L和奔驰E级的销量分别为12515辆、8700辆；今年前8个月的累计销量分别为127326辆、86844辆。尽管在燃油车板块保持领先，但“德系三强”却苦乐不均。宝马5系的销量由7月的7497辆，下降到8月的4174辆，这也导致其累计销量被奥迪A6L和奔驰E级拉开了较大差距。不知是不是巧合，近期有媒体报道称，“因‘价格战’导致门店亏损严重，宝马将从7月起通过减少销售量来稳定价格，缓解门店的经营压力.紧随其后，“南奥迪”——A7L的单月销量稳定地保持在2000-3000辆之间。数据显示，8月，奥迪A7L的销量为2520辆；今年前8个月的累计销量为18244辆。与奥迪A7L“师出同门”的大众辉昂，如“幽灵”一般，时不时地“闪现”在销量榜单中。8月，辉昂以“-1”辆的成绩出现，让人住摸不透它的库存和销售情况。沃尔沃S90和凯迪拉克CT6则分别稳定在2000辆和1000辆的销量区间。数据显示，8月，沃尔沃S90和凯迪拉克CT6的销量分别为1978辆、838辆；今年前8个月的累计销量分别为20543辆、6983辆。欲与“德系三强”叫板的红旗H9，在今年北京车展期间推出年度新款后，单月销量曾在4-6月突破1000辆，如今又被“打回原形”。数据显示，8月，红旗H9的销量为382辆；今年前8个月的累计销量为6431辆。',
      dataTable: [
        {
          品牌: '奥迪',
          车型: 'A6L',
          月份: '08',
          销量: 12515,
          累计销量: 127326
        },
        {
          品牌: '奔驰',
          车型: 'E级',
          月份: '08',
          销量: 8700,
          累计销量: 86844
        },
        {
          品牌: '宝马',
          车型: '5系',
          月份: '07',
          销量: 7497,
          累计销量: null
        },
        {
          品牌: '宝马',
          车型: '5系',
          月份: '08',
          销量: 4174,
          累计销量: null
        },
        {
          品牌: '奥迪',
          车型: 'A7L',
          月份: '08',
          销量: 2520,
          累计销量: 18244
        },
        {
          品牌: '大众',
          车型: '辉昂',
          月份: '08',
          销量: -1,
          累计销量: null
        },
        {
          品牌: '沃尔沃',
          车型: 'S90',
          月份: '08',
          销量: 1978,
          累计销量: 20543
        },
        {
          品牌: '凯迪拉克',
          车型: 'CT6',
          月份: '08',
          销量: 838,
          累计销量: 6983
        },
        {
          品牌: '红旗',
          车型: 'H9',
          月份: '08',
          销量: 382,
          累计销量: 6431
        }
      ],
      fieldInfo: [
        {
          fieldName: '品牌',
          description: '汽车品牌',
          fieldType: 'string'
        },
        {
          fieldName: '车型',
          description: '具体车型',
          fieldType: 'string'
        },
        {
          fieldName: '月份',
          description: '具体月份',
          fieldType: 'date',
          dateGranularity: 'month'
        },
        {
          fieldName: '销量',
          description: '单月销量',
          fieldType: 'numerical'
        },
        {
          fieldName: '累计销量',
          description: '今年前8个月的累计销量',
          fieldType: 'numerical'
        }
      ]
    },
    {
      isEnglish: false,
      text: '在新能源板块，有12款国产车型扎堆出现在8月的销量排行榜中，但市场表现却有着天壤之别。自带流量的小米SU7的8月销量突破1万辆，达13111辆，成功拿下新能源板块的亚军，同时也是整个C级车市场的亚军。据悉，目前小米汽车正在提升产能，并已开启双班生产，预计将在今年11月提前完成10万辆销量目标，有望实现全年12万辆的交付量。东风亦派 eπ007、长安启源A07、极狐阿尔法S5、极星Polestar 4 、阿维塔12、荣威 D7位列第二梯队，6款车型在8月的销量分别为4027辆、3656辆、2752辆、2669辆、1517辆、1485辆。在第三梯队，红旗 EH7、宝马 i5、智界S7、星途星纪元 ES、昊铂 Hyper GT等5款产品，在8月的销量分别为484辆、476辆、425辆、312辆、149辆。',
      dataTable: [
        {
          车型: '小米SU7',
          销量: 13111,
          梯队: '第一梯队'
        },
        {
          车型: '东风亦派 eπ007',
          销量: 4027,
          梯队: '第二梯队'
        },
        {
          车型: '长安启源A07',
          销量: 3656,
          梯队: '第二梯队'
        },
        {
          车型: '极狐阿尔法S5',
          销量: 2752,
          梯队: '第二梯队'
        },
        {
          车型: '极星Polestar 4',
          销量: 2669,
          梯队: '第二梯队'
        },
        {
          车型: '阿维塔12',
          销量: 1517,
          梯队: '第二梯队'
        },
        {
          车型: '荣威 D7',
          销量: 1485,
          梯队: '第二梯队'
        },
        {
          车型: '红旗 EH7',
          销量: 484,
          梯队: '第三梯队'
        },
        {
          车型: '宝马 i5',
          销量: 476,
          梯队: '第三梯队'
        },
        {
          车型: '智界S7',
          销量: 425,
          梯队: '第三梯队'
        },
        {
          车型: '星途星纪元 ES',
          销量: 312,
          梯队: '第三梯队'
        },
        {
          车型: '昊铂 Hyper GT',
          销量: 149,
          梯队: '第三梯队'
        }
      ],
      fieldInfo: [
        {
          fieldName: '车型',
          description: '汽车的具体型号',
          fieldType: 'string'
        },
        {
          fieldName: '销量',
          description: '汽车的销量',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '梯队',
          description: '汽车所在的梯队',
          fieldType: 'string'
        }
      ]
    },
    {
      isEnglish: false,
      text: '家住成都的王先生来到了四川苏宁成都天府立交店,准备换购一台空调。“最近太热了，家里的老空调不制冷、噪音大，刚好苏宁门店可以用政府补贴，就来看看。”王先生经过导购的专业介绍，选择了售价2499元倍科1.5P一级能效空调，门店优惠500元，个人还可再申请政府补贴400元，最终到手价格1599元。天府立交店刘利娟店长透露，王先生觉得这次优惠很大，不想错过，又为家里换新了售价2599元的海信10KG洗干一体机、售价12999元的康佳85吋mini-LED电视，洗干机门店优惠600元，政府补贴个人400元，电视门店优惠3000元，政府补贴个人2000元，相当于这次节省了6900元。',
      dataTable: [
        {
          商品: '倍科1.5P一级能效空调',
          售价: 2499,
          门店优惠: 500,
          政府补贴: 400,
          最终价格: 1599
        },
        {
          商品: '海信10KG洗干一体机',
          售价: 2599,
          门店优惠: 600,
          政府补贴: 400,
          最终价格: 1599
        },
        {
          商品: '康佳85吋mini-LED电视',
          售价: 12999,
          门店优惠: 3000,
          政府补贴: 2000,
          最终价格: 7999
        }
      ],
      fieldInfo: [
        {
          fieldName: '商品',
          description: '购买的商品名称',
          fieldType: 'string'
        },
        {
          fieldName: '售价',
          description: '商品原售价',
          fieldType: 'numerical'
        },
        {
          fieldName: '门店优惠',
          description: '门店优惠金额',
          fieldType: 'numerical'
        },
        {
          fieldName: '政府补贴',
          description: '政府补贴金额',
          fieldType: 'numerical'
        },
        {
          fieldName: '最终价格',
          description: '最终到手价格',
          fieldType: 'numerical'
        }
      ]
    },
    {
      isEnglish: false,
      text: 'OT128激光雷达是专为L4级无人驾驶车辆、工业机器人、智能港口以及ADAS（高级驾驶辅助系统）开发等高端应用场景而设计的。该产品采用了与AT128相同的成熟技术架构，具备高达345.6万点/秒的点频速率，最远探测距离可达230米，同时支持0.1°的最小角分辨率，为用户提供360°无拼接的全面视野覆盖。相较于传统的360°机械式激光雷达，OT128在生产效率上实现了显著提升。其零部件数量减少了66%，核心生产工序时间缩短了95%，且核心工序的自动化率达到了90%以上。这些改进不仅提升了生产效率，还有助于降低成本和提高产品的可靠性。',
      dataTable: [
        {
          产品: 'OT128',
          点频速率: 3456000,
          最远探测距离: 230,
          最小角分辨率: 0.1,
          视野覆盖角度: 360,
          零部件数量: 66,
          生产工序时间: 95,
          核心工序自动化率: 90
        }
      ],
      fieldInfo: [
        {
          fieldName: '产品',
          description: '产品名称',
          fieldType: 'string'
        },
        {
          fieldName: '点频速率',
          description: '点频速率',
          fieldType: 'numerical'
        },
        {
          fieldName: '最远探测距离',
          description: '最远探测距离',
          fieldType: 'numerical'
        },
        {
          fieldName: '最小角分辨率',
          description: '最小角分辨率',
          fieldType: 'numerical'
        },
        {
          fieldName: '视野覆盖角度',
          description: '视野覆盖的角度',
          fieldType: 'numerical'
        },
        {
          fieldName: '零部件数量',
          description: '零部件数量具体减少的百分比',
          fieldType: 'ratio'
        },
        {
          fieldName: '生产工序时间',
          description: '生产工序时间具体缩短的百分比',
          fieldType: 'ratio'
        },
        {
          fieldName: '核心工序自动化率',
          description: '核心工序自动化率百分比',
          fieldType: 'ratio'
        }
      ]
    },
    {
      isEnglish: false,
      text: '报告还显示，截至2023年，我国数字音乐用户规模约达9亿，占网民整体的82.4%。其中活跃用户群体中，男性占比53.6%， 女性占比46.4%。00后、10后活跃用户占比持续增长。',
      dataTable: [
        {
          音乐用户规模: 9000000000,
          音乐用户占比: 82.4,
          男性占比: 53.6,
          女性占比: 46.4
        }
      ],
      fieldInfo: [
        {
          fieldName: '音乐用户规模',
          description: '音乐用户规模',
          fieldType: 'numerical'
        },
        {
          fieldName: '音乐用户占比',
          description: '音乐用护用在网民整体中的总占比',
          fieldType: 'ratio'
        },
        {
          fieldName: '男性占比',
          description: '男性在音乐用户规模中的总占比',
          fieldType: 'ratio'
        },
        {
          fieldName: '女性占比',
          description: '女性在音乐用户规模中的总占比',
          fieldType: 'ratio'
        }
      ]
    },
    {
      isEnglish: true,
      text: 'However, an informal group of organisations are pushing back against the forces of digital entropy – many of them operated by volunteers with little institutional support. None is more synonymous with the fight to save the web than the Internet Archive, an American non-profit based in San Francisco, started in 1996 as a passion project by internet pioneer Brewster Kahl. The organisation has embarked what may be the most ambitious digital archiving project of all time, gathering 866 billion web pages, 44 million books, 10.6 million videos of films and television programmes and more. Housed in a handful of data centres scattered across the world, the collections of the Internet Archive and a few similar groups are the only things standing in the way of digital oblivion.',
      dataTable: [
        {
          organization: 'Internet Archive',
          'web pages number': 866000000000,
          'books number': 44000000,
          'videos of films and television programmes number': 10600000
        }
      ],
      fieldInfo: [
        {
          fieldName: 'organization',
          description: 'The name of organization',
          fieldType: 'string'
        },
        {
          fieldName: 'web pages number',
          description: 'the number of web pages',
          fieldType: 'numerical'
        },
        {
          fieldName: 'books number',
          description: 'the number of books',
          fieldType: 'numerical'
        },
        {
          fieldName: 'videos of films and television programmes number',
          description: 'the number of videos of films and television programmes',
          fieldType: 'numerical'
        }
      ]
    },
    {
      isEnglish: true,
      text: 'Snap’s latest AR glasses aren’t its first hardware product. The company has a history of experimenting with hardware and has launched smart glasses under the brand name Spectacles. However, the company has struggled to make money from selling hardware. It first debuted a pair of smart glasses in 2016; the $130 device made it easy for users to capture short, first-person videos that they could post on Snapchat. However, the product failed, and the company had to write down $40 million due to losses from unsold Spectacles. Snap once again tried to sell new Spectacles smart glasses in 2019—this time a more premium version for $380—but that too didn’t take off. In 2021, it unveiled new glasses with advanced AR capabilities, but instead of selling them to consumers, the company sold the device to developers, hinting that the glasses were more of a prototype than an actual consumer product. Beyond glasses, Snap also tried to sell a flying drone for $230, but that device was abruptly discontinued after just a few months',
      dataTable: [
        {
          year: 2016,
          product: 'Spectacles',
          price: 130
        },
        {
          year: 2019,
          product: 'Spectacles (premium version)',
          price: 380
        },
        {
          year: 2021,
          product: 'new glasses with AR',
          price: null
        },
        {
          year: null,
          product: 'flying drone',
          price: 230
        }
      ],
      fieldInfo: [
        {
          fieldName: 'year',
          description: 'The year when the product was launched',
          fieldType: 'date',
          dateGranularity: 'year'
        },
        {
          fieldName: 'product',
          description: 'the name of product',
          fieldType: 'string'
        },
        {
          fieldName: 'price',
          description: 'The price of the product',
          fieldType: 'numerical'
        }
      ]
    }
  ]
};

const realEstateData = {
  domain: '房地产',
  data: [
    {
      isEnglish: false,
      text: `2022年全国GDP约为121万亿元，同比增加3%，全国房地产开发投资达13万亿元，同比下降10%，占全国生产总值的10.7%，可见房地产行业处于国民经济的支柱地位。但部分房地产企业前期急速扩张，盲目追求高周转，加之市场下行，购房者对地产行业信心不足，现金无法及时回流，导致房地产企业财务状况不断恶化，很多房地产企业触碰“三道红线”，进而加剧了融资困难。这无疑威胁着企业的生存和发展。因此，研究房地产企业财务风险及管理是非常必要的。`,
      fieldInfo: [
        {
          fieldName: '全国GDP',
          fieldType: 'numerical',
          description: '全国GDP值'
        },
        {
          fieldName: '房地产开发总投资',
          fieldType: 'numerical',
          description: '全国房地产开发投资值'
        },
        {
          fieldName: '全国GDP同比',
          fieldType: 'ratio',
          description: '全国GDP同比值'
        },
        {
          fieldName: '房地产占比',
          fieldType: 'ratio',
          description: '房地产占全国gdp总值百分比'
        },
        {
          fieldName: '房地产同比',
          fieldType: 'ratio',
          description: '房地产同比变化'
        }
      ],
      dataTable: [
        {
          全国GDP: 121000000000000,
          房地产开发总投资: 13000000000000,
          全国GDP同比: 3,
          房地产占比: 10.7,
          房地产同比: -10
        }
      ]
    },
    {
      isEnglish: false,
      text: `
2023年上半年，房地产政策环境整体延续了去年末以来的宽松态势，如优化限购、优化限价、优化限贷、优化限售、购房补贴等，政策的导向主要是支持企业、稳定市场，以促进房地产行业的回稳。然而，尽管政策环境有所改善，但房地产开发投资的情况仍然严峻。国家统计局数据显示，2023年1—10月，全国房地产开发投资95922亿元，同比下降9.3%，其中，住宅投资72799亿元，下降8.8%。2023年1—10月，商品房销售面积92579万平方米，同比下降7.8%，其中住宅销售面积下降6.8%。商品房销售额97161亿元，下降了4.9%，其中住宅销售额下降3.7%。2023年1—10月，房地产开发企业到位资金总额107345亿元，同比下降13.8%，其中，国内贷款13117亿元，下降11.0%，利用外资37亿元，下降40.3%，自筹资金总额34781亿元，下降21.4%，定金及预收款36596亿元，下降10.4%，个人按揭贷款18506亿元，下降7.6%。2023年10月，房地产开发景气指数（简称“国房景气指数”）为93.40。此外，房地产开发企业的到位资金也出现了同比下降的情况。见图1。这表明，尽管政策环境在改善，但由于市场环境的变化和企业内部因素，房地产企业仍面临一定的经营压力。;
`,
      fieldInfo: [
        {
          fieldName: 'name',
          fieldType: 'string',
          description: 'name'
        },
        {
          fieldName: 'value',
          fieldType: 'numerical',
          description: 'value'
        },
        {
          fieldName: 'unit',
          fieldType: 'string',
          description: 'unit'
        },
        {
          fieldName: 'isPercent',
          fieldType: 'boolean',
          description: 'isPercent'
        },
        {
          fieldName: 'year',
          fieldType: 'string',
          description: 'year'
        },
        {
          fieldName: 'monthRange',
          fieldType: 'number[]',
          description: 'monthRange'
        }
      ],
      dataTable: [
        {
          name: '全国房地产开发投资',
          value: 95922,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '全国房地产开发投资同步下降率',
          value: 9.3,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '住宅投资',
          value: 72799,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '住宅投资同比下降',
          value: 8.8,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '商品房销售总面积',
          value: 92579,
          unit: '万平方米',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '商品房销售总面积同比下降',
          value: 7.8,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '住宅销售面积同比下降',
          value: 6.8,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },

        {
          name: '商品房销售额',
          value: 97161,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '同比下降',
          value: 4.9,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },

        {
          name: '住宅销售额同比下降',
          value: 3.7,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '房地产开发企业到位资金总额',
          value: 107345,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '房地产开发企业到位资金总额',
          value: 107345,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '房地产开发企业到位资金总额同比下降',
          value: 13.8,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '国内贷款',
          value: 13117,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '国内贷款同比下降',
          value: 11,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '利用外资',
          value: 37,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '利用外资同比下降',
          value: 40.3,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '自筹资金总额',
          value: 34781,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '自筹资金总额同比下降',
          value: 21.4,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '定金及预收款',
          value: 36596,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '定金及预收款同比下降',
          value: 10.4,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '个人按揭贷款',
          value: 18506,
          unit: '亿元',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '个人按揭贷款同比下降',
          value: 7.6,
          unit: '%',
          isPercent: true,
          year: '2023',
          monthRange: [1, 10]
        },
        {
          name: '房地产开发景气指数',
          value: 93.4,
          unit: '',
          isPercent: false,
          year: '2023',
          monthRange: [1, 10]
        }
      ]
    },
    {
      isEnglish: false,
      text: `
  1—8月份，房地产开发企业房屋施工面积709420万平方米，同比下降12.0%。其中，住宅施工面积496052万平方米，下降12.6%。房屋新开工面积49465万平方米，下降22.5%。其中，住宅新开工面积35909万平方米，下降23.0%。房屋竣工面积33394万平方米，下降23.6%。其中，住宅竣工面积24393万平方米，下降23.2%。;
      `,
      fieldInfo: [
        {
          fieldName: 'name',
          fieldType: 'string',
          description: 'name'
        },
        {
          fieldName: 'value',
          fieldType: 'numerical',
          description: 'value'
        },
        {
          fieldName: 'unit',
          fieldType: 'string',
          description: 'unit'
        },
        {
          fieldName: 'monthRange',
          fieldType: 'numerical',
          description: 'monthRange'
        },
        {
          fieldName: 'year',
          fieldType: 'numerical',
          description: 'year'
        },
        {
          fieldName: 'isPercent',
          fieldType: 'boolean',
          description: 'isPercent'
        }
      ],
      dataTable: [
        {
          name: '房地产开发企业房屋施工面积',
          value: 709420,
          unit: '万平方米',
          isPercent: false,
          monthRange: [1, 8]
        },
        {
          name: '房地产开发企业房屋施工面积同比下降',
          value: 12,
          unit: '%',
          isPercent: true,
          monthRange: [1, 8]
        },
        {
          name: '住宅施工面积',
          value: 496052,
          unit: '万平方米',
          isPercent: false,
          monthRange: [1, 8]
        },
        {
          name: '住宅施工面积同比下降',
          value: 12.6,
          unit: '%',
          isPercent: true,
          monthRange: [1, 8]
        },
        {
          name: '房屋新开工面积',
          value: 49465,
          unit: '万平方米',
          isPercent: false,
          monthRange: [1, 8]
        },
        {
          name: '房屋新开工面积同比下降',
          value: 22.5,
          unit: '%',
          isPercent: true,
          monthRange: [1, 8]
        },
        {
          name: '住宅新开工面积',
          value: 35909,
          unit: '万平方米',
          isPercent: false,
          monthRange: [1, 8]
        },
        {
          name: '住宅新开工面积同比下降',
          value: 23,
          unit: '%',
          isPercent: true,
          monthRange: [1, 8]
        },
        {
          name: '房屋竣工面积',
          value: 33394,
          unit: '万平方米',
          isPercent: false,
          monthRange: [1, 8]
        },
        {
          name: '房屋竣工面积同比下降',
          value: 23.6,
          unit: '%',
          isPercent: true,
          monthRange: [1, 8]
        },
        {
          name: '住宅竣工面积',
          value: 24393,
          unit: '万平方米',
          isPercent: false,
          monthRange: [1, 8]
        },
        {
          name: '住宅竣工面积同比下降',
          value: 23.2,
          unit: '%',
          isPercent: true,
          monthRange: [1, 8]
        }
      ]
    },
    {
      isEnglish: false,
      text: `
      从2016年至2020年，由于房价上涨以及一二线城市的成交占比上升，房地产年成交金额从14万亿元升至17万亿元，但年销售面积基本稳定在16亿平方米左右，几乎没有增长`,
      fieldInfo: [
        {
          fieldName: 'name',
          fieldType: 'string',
          description: 'name'
        },
        {
          fieldName: 'value',
          fieldType: 'numerical',
          description: 'value'
        },
        {
          fieldName: 'unit',
          fieldType: 'string',
          description: 'unit'
        },
        {
          fieldName: 'year',
          fieldType: 'string',
          description: 'year'
        }
      ],
      dataTable: [
        {
          name: '房地产年成交金额',
          year: '2016',
          value: 14,
          unit: '万亿元'
        },
        {
          name: '房地产年成交金额',
          year: '2020',
          value: 17,
          unit: '万亿元'
        },
        {
          name: '年销售面积',
          year: '2016',
          value: 16,
          unit: '亿元'
        },
        {
          name: '年销售面积',
          year: '2020',
          value: 16,
          unit: '亿元'
        }
      ]
    },
    {
      isEnglish: false,
      text: `2004-2019年全年，全国商品房销售均价（元/平方米）约2778，3167，3366，3863，3800，4681，5032，5357，5790，6237，6324，6793，7476，7892，8736，9310。`,
      fieldInfo: [
        {
          fieldName: 'name',
          fieldType: 'string',
          description: 'name'
        },
        {
          fieldName: 'value',
          fieldType: 'numerical',
          description: 'value'
        },
        {
          fieldName: 'unit',
          fieldType: 'string',
          description: 'unit'
        },
        {
          fieldName: 'year',
          fieldType: 'string',
          description: 'year'
        }
      ],
      dataTable: [
        {
          year: '2004',
          value: 2778,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2005',
          value: 3167,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2006',
          value: 3366,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2007',
          value: 3863,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2008',
          value: 3800,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2009',
          value: 4681,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2010',
          value: 5032,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2011',
          value: 5357,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2012',
          value: 5790,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2013',
          value: 6237,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2014',
          value: 6324,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2015',
          value: 6793,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2016',
          value: 7476,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2017',
          value: 7892,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2018',
          value: 8736,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        },
        {
          year: '2019',
          value: 9310,
          unit: '元/平方米',
          name: '全国商品房销售均价'
        }
      ]
    },
    {
      isEnglish: false,
      text: `
  2013年10月，王健林（万达集团董事长）860亿元荣登中国大陆首富。 [11]（福布斯中国大陆富豪榜）
  2015年03月，王健林242亿美元，中国大陆首富。（福布斯）
  2017年10月，许家印（恒大地产集团董事局主席）以2900亿元成为中国首富。（2017胡润百富榜）
  2018年福布斯中国大陆富豪榜，前400富豪中房地产行业占大多数。其中，前三位富豪是：许家印（No.3，2125亿元）、王健林（No.4，1566亿）、杨惠妍（No.6，1180亿） [12]
  2018年前五名的中国女富豪中，有四位来自房地产行业。其中，碧桂园的联席主席杨惠妍以1269亿元，再度蝉联中国最富有女性榜榜首。龙湖集团董事长吴亚军以607.5亿元财富位居第二名，富华国际集团主席陈丽华以391.5亿元财富位居第三名。 [13]
  `,
      fieldInfo: [
        {
          fieldName: 'name',
          description: '名称',
          fieldType: 'string'
        },
        {
          fieldName: 'value',
          description: '值',
          fieldType: 'numerical'
        },
        {
          fieldName: 'unit',
          description: '单位',
          fieldType: 'string'
        },
        {
          fieldName: 'gender',
          description: '性别',
          fieldType: 'string'
        },
        {
          fieldName: 'year',
          description: '年份',
          fieldType: 'string'
        },
        {
          fieldName: 'month',
          description: '月份',
          fieldType: 'string'
        }
      ],
      dataTable: [
        {
          year: '2013',
          month: '10月',
          name: '王健林',
          value: 860,
          unit: '亿元'
        },
        {
          year: '2015',
          month: '3月',
          name: '王健林',
          value: 242,
          unit: '亿元'
        },
        {
          year: '2017',
          month: '10月',
          name: '许家印',
          value: 2900,
          unit: '亿元'
        },
        {
          year: '2018',
          name: '许家印',
          value: 2125,
          unit: '亿元'
        },
        {
          year: '2018',
          name: '王健林',
          value: 1566,
          unit: '亿元'
        },
        {
          year: '2018',
          name: '杨惠妍',
          value: 1180,
          unit: '亿元'
        },
        {
          year: '2018',
          name: '杨惠妍',
          value: 1269,
          unit: '亿元',
          gender: '女'
        },
        {
          year: '2018',
          name: '吴亚军',
          value: 607.5,
          unit: '亿元',
          gender: '女'
        },
        {
          year: '2018',
          name: '陈丽华',
          value: 391.5,
          unit: '亿元',
          gender: '女'
        }
      ]
    },
    {
      isEnglish: false,
      text: `1-8月，北京市房屋施工面积10870.3万平方米，同比下降9.9%，其中住宅施工面积5434.9万平方米，下降9.1%。北京市商品房销售面积658.1万平方米，同比下降5.1%，其中住宅销售面积466.6万平方米，下降8.7%。
  `,
      fieldInfo: [
        {
          fieldName: 'name',
          fieldType: 'string',
          description: 'name'
        },
        {
          fieldName: 'value',
          fieldType: 'numerical',
          description: 'value'
        },
        {
          fieldName: 'monthRange',
          fieldType: 'string',
          description: 'monthRange'
        },
        {
          fieldName: 'unit',
          fieldType: 'string',
          description: 'unit'
        }
      ],
      dataTable: [
        {
          name: '北京市房屋施工面积',
          monthRange: '1-8月',
          value: 10870.3,
          unit: '万平方米'
        },
        {
          name: '北京市房屋施工面积同比下降',
          monthRange: '1-8月',
          value: 9.9,
          unit: '%'
        },
        {
          name: '住宅施工面积',
          monthRange: '1-8月',
          value: 5434.9,
          unit: '万平方米'
        },
        {
          name: '住宅施工面积同比下降',
          monthRange: '1-8月',
          value: 9.1,
          unit: '%'
        },
        {
          name: '北京市商品房销售面积',
          monthRange: '1-8月',
          value: 658.1,
          unit: '万平方米'
        },
        {
          name: '北京市商品房销售面积同比下降',
          monthRange: '1-8月',
          value: 5.1,
          unit: '%'
        },
        {
          name: '住宅销售面积',
          monthRange: '1-8月',
          value: 466.6,
          unit: '万平方米'
        },
        {
          name: '住宅销售面积同比下降',
          monthRange: '1-8月',
          value: 8.7,
          unit: '%'
        }
      ]
    },
    {
      isEnglish: false,
      text: `近年来建筑工程系在人才培养、教学改革、科学研究、学科建设、国际交流、社会服务、系企合作等各个层面取得了国内外公认的丰硕成果。每年平均招收各类硕士研究生220多名、博士研究生50多名`,
      fieldInfo: [
        {
          fieldName: '人员类型',
          description: '学生的类型',
          fieldType: 'string'
        },
        {
          fieldName: '人数',
          description: '学生的人数',
          fieldType: 'numerical'
        }
      ],
      dataTable: [
        {
          人员类型: '研究生',
          人数: 220
        },
        {
          人员类型: '博士生',
          人数: 50
        }
      ]
    },
    {
      isEnglish: false,
      text: `此次调查显示，如果将东京港区元麻布的分户出售住宅的每坪(3.3平方米)单价定为100(按日元计算)，大阪为68.2，与全球15个主要城市中最高的香港(268.2)相比，均不到一半。在其他主要城市中，从高到低依次为伦敦的207.5，台北和上海165.6，纽约144.6，新加坡140.2。`,
      fieldInfo: [
        {
          fieldName: '位置',
          fieldType: 'string',
          description: '位置'
        },
        {
          fieldName: '出售住宅的每坪单价',
          fieldType: 'numerical',
          description: '出售住宅的每坪单价'
        }
      ],
      dataTable: [
        {
          位置: '东京港区元麻布',
          出售住宅的每坪单价: 100
        },
        {
          位置: '大阪',
          出售住宅的每坪单价: 68.2
        },
        {
          位置: '香港',
          出售住宅的每坪单价: 268.2
        },
        {
          位置: '伦敦',
          出售住宅的每坪单价: 207.5
        },
        {
          位置: '台北',
          出售住宅的每坪单价: 165.6
        },
        {
          位置: '上海',
          出售住宅的每坪单价: 144.6
        },
        {
          位置: '纽约',
          出售住宅的每坪单价: 140.2
        },
        {
          位置: '新加坡',
          出售住宅的每坪单价: 140.2
        }
      ]
    },
    {
      isEnglish: true,
      text: `Alabama
Typical single-family home price: $220,659 (63% of the U.S. typical home price)
Median household income as a percentage of home value: 27%
Alabama is relatively affordable. The median household income is 80% of the national level, but home prices rank ninth lowest in the country.
Alaska
Typical single-family home price: $369,997 (106% of the U.S. typical home price)
Median household income as a percentage of home value: 24%
Alaska's home prices are 6% higher than the national average, but the median income is 18% higher, offsetting each other.
Arizona
Typical single-family home price: $430,577 (123% of the U.S. typical home price)
Median household income as a percentage of home value: 17%
Arizona's home prices are expensive, 23% higher than the U.S. average. The median household income is on par with the national average, making home buying less affordable.
Arkansas
Typical single-family home price: $198,511 (57% of the U.S. typical home price)
Median household income as a percentage of home value: 28%
Arkansas has the third-lowest home prices in the U.S. Despite the median household income being 26% lower than the national average, the income-to-home value ratio is the highest (best).
California
Typical single-family home price: $760,526 (217% of the U.S. typical home price)
Median household income as a percentage of home value: 12%
California has the second-highest home prices in the U.S., and the income-to-home value ratio is the second-lowest, despite residents' incomes being 22% higher than the U.S. median.
Colorado
Typical single-family home price: $548,012 (157% of the U.S. typical home price)
Median household income as a percentage of home value: 16%
Colorado's home prices rank sixth in the nation, while the income-to-home value ratio ranks sixth lowest, despite the median household income being 19% higher than the national average.
Connecticut
Typical single-family home price: $405,050 (116% of the U.S. typical home price)
Median household income as a percentage of home value: 22%
Connecticut's home prices are 16% higher than the U.S. typical home price, but the state has a relatively high income-to-home value ratio, making homes somewhat affordable.
Delaware
Typical single-family home price: $370,761 (106% of the U.S. typical home price)
Median household income as a percentage of home value: 22%
Delaware's home prices are 6% higher than the U.S. typical home price, but the median household income is 10% higher, offsetting each other.
District of Columbia
Typical single-family home price: $722,619 (206% of the U.S. typical home price)
Median household income as a percentage of home value: 14%
Washington D.C. has the third-highest home prices in the nation, and the income-to-home value ratio is the third-lowest, despite the median income being 35% higher than the national median.
Florida
Typical single-family home price: $407,218 (116% of the U.S. typical home price)
Median household income as a percentage of home value: 17%
Florida's home prices are 16% higher than the U.S. typical home price, but the median household income is 7% lower, leading to a low income-to-home value ratio and affordability concerns.
Georgia
Typical single-family home price: $320,091 (91% of the U.S. typical home price)
Median household income as a percentage of home value: 23%
Georgia's home prices are not expensive, but the median household income is below the national median, making affordability average.
Hawaii
Typical single-family home price: $971,167 (277% of the U.S. typical home price)
Median household income as a percentage of home value: 10%
Hawaii has the most expensive and least affordable home prices in the nation, despite the median income being 24% higher than the national median, the income-to-home value ratio is very low.
Idaho
Typical single-family home price: $444,451 (127% of the U.S. typical home price)
Median household income as a percentage of home value: 16%
Idaho's home prices are 27% higher than the U.S. average, leading to affordability issues as the median household income is 3% lower than the national average.`,
      fieldInfo: [
        {
          fieldName: 'name',
          fieldType: 'string',
          description: 'name of state'
        },
        {
          fieldName: 'price',
          fieldType: 'string',
          description: 'price of house'
        }
      ],
      dataTable: [
        {
          name: 'Alabama',
          price: '369,997'
        },
        {
          name: 'Arizona',
          price: '430,577'
        },
        {
          name: 'Arkansas',
          price: '198,511'
        },
        {
          name: 'California',
          price: '760,526'
        },
        {
          name: 'Colorado',
          price: '548,012'
        },
        {
          name: 'Connecticut',
          price: '405,050'
        },
        {
          name: 'Delaware',
          price: '370,761'
        },
        {
          name: 'District of Columbia',
          price: '722,619'
        },
        {
          name: 'Florida',
          price: '407,218'
        },
        {
          name: 'Georgia',
          price: '320,091'
        },
        {
          name: 'Hawaii',
          price: '971,167'
        },
        {
          name: 'Idaho',
          price: '444,451'
        }
      ]
    }
  ]
};

const enviromentData = {
  domain: 'enviroment',
  data: [
    {
      isEnglish: false,
      text: `2014年，全国近岸海域总体水质基本保持稳定，水质级别为一般, 主要超标因子是无机氮和活性磷酸盐。按照监测点位计算：一类海水比例为28.6%，与上年相比，上升4.0个百分点；二类海水比例为38.2%，下降3.6个百分点；三类海水比例为7.0%，下降1.0个百分点；四类海水比例为7.6%，上升0.6个百分点；劣四类海水比例为18.6%，比例持平。`,
      fieldInfo: [
        {
          fieldName: '类别',
          fieldType: 'string',
          description: 'type'
        },
        {
          fieldName: '比例',
          fieldType: 'ratio',
          description: 'percent'
        },
        {
          fieldName: '同比变化',
          fieldType: 'number',
          description: 'change'
        }
      ],
      dataTable: [
        {
          类别: '一类',
          比例: 28.6,
          同比变化: 4.0
        },
        {
          类别: '二类',
          比例: 38.2,
          同比变化: -3.6
        },
        {
          类别: '三类',
          比例: 7.0,
          同比变化: -1.0
        },
        {
          类别: '四类',
          比例: 7.6,
          同比变化: 0.6
        },
        {
          类别: '劣四类',
          比例: 18.6,
          同比变化: 0
        }
      ]
    },
    {
      isEnglish: false,
      text: `四大海区中,渤海点位超标率为28.6%,平均浓度为0.256毫克/升:黄海点位超标率为11.1%,平均浓度为0.193毫克/升;东海点位超标率为62.1%,平均浓度为0.577毫克/升;南海点位超标率为8.7%,平均浓度为0.184毫克/升。`,
      fieldInfo: [
        {
          fieldName: '海区',
          fieldType: 'region',
          description: 'Sea Area'
        },
        {
          fieldName: '超标率',
          fieldType: 'number',
          description: 'Exceeding standard rate'
        },
        {
          fieldName: '浓度',
          fieldType: 'number',
          description: 'Chemical Concentration'
        }
      ],
      dataTable: [
        {
          海区: '渤海',
          超标率: 28.6,
          浓度: 0.256
        },
        {
          海区: '黄海',
          超标率: 11.1,
          浓度: 0.193
        },
        {
          海区: '东海',
          超标率: 62.1,
          浓度: 0.577
        },
        {
          海区: '南海',
          超标率: 8.7,
          浓度: 0.184
        }
      ]
    },
    {
      isEnglish: false,
      text: `2018年,对辽河口、海河口、黄河口、长江口、九龙江口和珠江口开展了沉积物质量监测。6个河口区域沉积物质量总体趋好。辽河口、海河口、黄河口、长江口沉积物质量良好的点位比例均为100.0%;九龙江口沉积物质量良好的点位比例为81.8%,个别点位铜和锌含量超标;珠江口沉积物质量一般,质量良好的点位比例为64.1%,主要超标要素为铜。`,
      fieldInfo: [
        {
          fieldName: '区域',
          fieldType: 'region',
          description: 'area'
        },
        {
          fieldName: '沉淀物质量',
          fieldType: 'string',
          description: '沉淀物'
        },
        {
          fieldName: '量好点位比例',
          fieldType: 'ratio',
          description: 'percent'
        }
      ],
      dataTable: [
        {
          区域: '辽河口',
          沉淀物质量: '良好',
          量好点位比例: 100.0
        },
        {
          区域: '海河口',
          沉淀物质量: '良好',
          量好点位比例: 100.0
        },
        {
          区域: '黄河口',
          沉淀物质量: '良好',
          量好点位比例: 100.0
        },
        {
          区域: '长江口',
          沉淀物质量: '良好',
          量好点位比例: 100.0
        },
        {
          区域: '九龙江口',
          沉淀物质量: '良好',
          量好点位比例: 81.8
        },
        {
          区域: '珠江口',
          沉淀物质量: '一般',
          量好点位比例: 64.1
        }
      ]
    },
    {
      isEnglish: false,
      text: `2018年,在大连老虎滩、大连大黑石、营口、盘锦、葫芦岛、秦皇岛、塘沽、东营、蓬莱、北隍城、青岛小麦岛、连云港、舟山嵊山、福建北碟、珠海大万山、广东遮浪、广西涠洲岛和海南博鳌等18个监测站开展了海洋大气气溶胶污染物含量监测。气溶胶中硝酸盐含量最高值(4.1微克/立方米)出现在塘沽监测站,最低值(0.9微克/立方米)出现在广西潤洲岛监测站;铵盐含量量高值(5.4微克/立方米)出现在营口监测站,最低值(1.0微克/立方米)出现在海南博鳌监测站;铜含量最高值(71.0纳克/立方米)出现在连云港监测站,最低值(5.3纳克/立方)米)出现在青岛小麦岛监测站;铅含量最高值(137.7纳克/立方米)出现在塘沽监测站,最低值(3.4纳克/立方米)出现在广东遮浪监测站。`,
      fieldInfo: [
        {
          fieldName: '污染物',
          fieldType: 'string',
          description: 'Pollutants'
        },
        {
          fieldName: '监测站',
          fieldType: 'string',
          description: 'place'
        },
        {
          fieldName: '含量',
          fieldType: 'number',
          description: 'content'
        },
        {
          fieldName: '极值类型',
          fieldType: 'string',
          description: 'type'
        }
      ],
      dataTable: [
        {
          污染物: '硝酸盐',
          监测站: '塘沽',
          含量: 4.1,
          极值类型: '最大值'
        },
        {
          污染物: '铵盐',
          监测站: '营口',
          含量: 5.4,
          极值类型: '最大值'
        },
        {
          污染物: '铜',
          监测站: '连云港',
          含量: 71.0,
          极值类型: '最大值'
        },
        {
          污染物: '铅',
          监测站: '塘沽',
          含量: 137.7,
          极值类型: '最大值'
        },
        {
          污染物: '硝酸盐',
          监测站: '广西潤洲岛',
          含量: 0.9,
          极值类型: '最小值'
        },
        {
          污染物: '铵盐',
          监测站: '海南博鳌',
          含量: 1.0,
          极值类型: '最小值'
        },
        {
          污染物: '铜',
          监测站: '青岛小麦岛',
          含量: 5.3,
          极值类型: '最小值'
        },
        {
          污染物: '铅',
          监测站: '广东遮浪',
          含量: 3.4,
          极值类型: '最小值'
        }
      ]
    },
    {
      isEnglish: false,
      text: `渤海大气污染物湿沉降通量2018年,在大连大黑石、营口仙人岛、盘锦、秦皇岛、塘沽、东营、蓬莱和北隍城监测站开展了大气污染物湿沉降通重监测。硝酸盐和铵盐湿沉降通量最高值均出现在东营监测站,分别为1.1吨/(平方千米年)和1.2吨/(平方千米·年),硝酸盐湿沉降通量最低值出现在大连大黑石、蓬莱、秦皇岛、盘锦和营口仙人岛监测站,为0.3吨/(平方千米·年),铵盐湿沉降通量最低值出现现在秦皇岛和蓬莱监测站,为0.2吨/(平方千米·年);铜湿沉降通量最高值出现在东营监测测站,为3.2千克/(平方千米·年),最低值出现在营口仙人岛监测站,为0.8千克/(平方千米年);铅湿沉降通量最高值出现在东营监测站,为0.9千克/(平方千米·年),最低值出现在大连大黑石监测站,为0.3千克/(平方千米·年)。`,
      fieldInfo: [
        {
          fieldName: '污染物',
          fieldType: 'string',
          description: 'Pollutants'
        },
        {
          fieldName: '监测站',
          fieldType: 'string',
          description: 'place'
        },
        {
          fieldName: '沉降通量',
          fieldType: 'number',
          description: 'flux'
        },
        {
          fieldName: '极值类型',
          fieldType: 'string',
          description: 'type'
        }
      ],
      dataTable: [
        {
          污染物: '硝酸盐',
          监测站: '东营',
          沉降通量: 1.1,
          极值类型: '最大值'
        },
        {
          污染物: '铵盐',
          监测站: '东营',
          沉降通量: 1.2,
          极值类型: '最大值'
        },
        {
          污染物: '硝酸盐',
          监测站: '大连大黑石',
          沉降通量: 0.3,
          极值类型: '最小值'
        },
        {
          污染物: '铵盐',
          监测站: '大连大黑石',
          沉降通量: 0.2,
          极值类型: '最小值'
        },
        {
          污染物: '硝酸盐',
          监测站: '营口仙人岛',
          沉降通量: 0.3,
          极值类型: '最小值'
        },
        {
          污染物: '铵盐',
          监测站: '营口仙人岛',
          沉降通量: 0.2,
          极值类型: '最小值'
        },
        {
          污染物: '硝酸盐',
          监测站: '秦皇岛',
          沉降通量: 0.3,
          极值类型: '最小值'
        },
        {
          污染物: '铵盐',
          监测站: '秦皇岛',
          沉降通量: 0.2,
          极值类型: '最小值'
        },
        {
          污染物: '硝酸盐',
          监测站: '盘锦',
          沉降通量: 0.3,
          极值类型: '最小值'
        },
        {
          污染物: '铵盐',
          监测站: '盘锦',
          沉降通量: 0.2,
          极值类型: '最小值'
        },
        {
          污染物: '铜',
          监测站: '东营',
          沉降通量: 3.2,
          极值类型: '最大值'
        },
        {
          污染物: '铅',
          监测站: '东营',
          沉降通量: 0.9,
          极值类型: '最大值'
        }
      ]
    },
    {
      isEnglish: false,
      text: `引发赤潮的优势生物共有18种。米氏凯伦藻引发的赤潮次数最多,并为7次;其次是中肋骨条藻,引发赤潮次数为6次;东海原甲藻为5次;链状裸甲藻、夜光藻各3次;红色赤潮藻、锥状施克里普藻、球形棕囊藻、丹麦细柱藻和旋链角毛毛藻各2次;叉角藻、多纹膝沟藻、双胞旋沟藻、短角弯角藻、刚毛根管藻、斯氏根管藻和海洋卡盾藻、红色中缢虫各1次。甲藻、着色鞭毛藻引发的赤潮共计25次,约占赤潮总数数的69%。`,
      fieldInfo: [
        {
          fieldName: '生物类型',
          fieldType: 'string',
          description: 'type'
        },
        {
          fieldName: '次数',
          fieldType: 'number',
          description: 'count'
        }
      ],
      dataTable: [
        {
          生物类型: '米氏凯伦藻',
          次数: 7
        },
        {
          生物类型: '中肋骨条藻',
          次数: 6
        },
        {
          生物类型: '东海原甲藻',
          次数: 5
        },
        {
          生物类型: '链状裸甲藻',
          次数: 3
        },
        {
          生物类型: '绿色赤潮藻',
          次数: 3
        },
        {
          生物类型: '锥状施克里普藻',
          次数: 2
        },
        {
          生物类型: '球形棕囊藻',
          次数: 2
        },
        {
          生物类型: '丹麦细柱藻',
          次数: 2
        },
        {
          生物类型: '旋链角毛毛藻',
          次数: 2
        },
        {
          生物类型: '红色赤潮藻',
          次数: 1
        },
        {
          生物类型: '叉角藻',
          次数: 1
        },
        {
          生物类型: '多纹膝沟藻',
          次数: 1
        },
        {
          生物类型: '双胞旋沟藻',
          次数: 1
        },
        {
          生物类型: '短角弯角藻',
          次数: 1
        },
        {
          生物类型: '刚毛根管藻',
          次数: 1
        },
        {
          生物类型: '斯氏根管藻',
          次数: 1
        },
        {
          生物类型: '海洋卡盾藻',
          次数: 1
        },
        {
          生物类型: '红色中缢虫',
          次数: 1
        }
      ]
    },
    {
      isEnglish: false,
      text: `2019年,全国海洋自然保护地稳步拓展,新增2处省级海洋自然保护地,新增面积1712.27平方千米,分别为舟山市东部省级海洋特别保护区和温州市龙湾省级海洋特别保护区,面积分别为1689.32平方千米和22.95平方千米。调整1处海洋保护地面积,大连长山群岛国家级海洋公园由原面积519.39平方千米调整为518.22平方千米,面积减少1.17平方千米。`,
      fieldInfo: [
        {
          fieldName: '保护地名称',
          fieldType: 'string',
          description: 'name'
        },
        {
          fieldName: '保护地级别',
          fieldType: 'string',
          description: 'level'
        },
        {
          fieldName: '新增或调整',
          fieldType: 'string',
          description: 'add or adjust'
        },
        {
          fieldName: '面积',
          fieldType: 'number',
          description: 'area'
        },
        {
          fieldName: '面积变化',
          fieldType: 'number',
          description: 'area change'
        }
      ],
      dataTable: [
        {
          保护地名称: '舟山市东部省级海洋特别保护区',
          保护地级别: '省级',
          新增或调整: '新增',
          面积: 1689.32,
          面积变化: 0
        },
        {
          保护地名称: '温州市龙湾省级海洋特别保护区',
          保护地级别: '省级',
          新增或调整: '新增',
          面积: 22.95,
          面积变化: 0
        },
        {
          保护地名称: '大连长山群岛国家级海洋公园',
          保护地级别: '国家级',
          新增或调整: '调整',
          面积: 518.22,
          面积变化: -1.17
        }
      ]
    },
    {
      isEnglish: false,
      text: `全国降水中主要阳离子为钙离子和铵离子,当量浓度比例分别为28.4%和12.2%;主要阴离子为硫酸根,当量浓度比例为18.7%,硝酸根当量浓度比例为7.7%,`,
      fieldInfo: [
        {
          fieldName: '离子类型',
          fieldType: 'string',
          description: 'Ion Type'
        },
        {
          fieldName: '离子名称',
          fieldType: 'string',
          description: 'Ion Name'
        },
        {
          fieldName: '浓度比例',
          fieldType: 'number',
          description: 'Concentration Ratio'
        }
      ],
      dataTable: [
        {
          离子类型: '阳离子',
          离子名称: '钙',
          浓度比例: 28.4
        },
        {
          离子类型: '阳离子',
          离子名称: '铵',
          浓度比例: 12.2
        },
        {
          离子类型: '阴离子',
          离子名称: '硫酸根',
          浓度比例: 18.7
        },
        {
          离子类型: '阴离子',
          离子名称: '硝酸根',
          浓度比例: 7.7
        }
      ]
    },
    {
      isEnglish: false,
      text: `环湖河流水质为优。监测的133个国考断面中,I类水质断面占0.8%,II类占29.3%,III类占67.7%,IV类占0.8%,V类占1.5%,无劣V类。与2020年相比,II类水质断面比例上升8.2个百分点,II类下降5.2个百分点,IV类下降4.5个百分点,V类上升1.5个百分点,其他类持平。`,
      fieldInfo: [
        {
          fieldName: '类型',
          fieldType: 'string',
          description: 'type'
        },
        {
          fieldName: '占比',
          fieldType: 'ratio',
          description: 'percent'
        },
        {
          fieldName: '同比变化',
          fieldType: 'number',
          description: 'change'
        }
      ],
      dataTable: [
        {
          类型: 'I类',
          占比: 0.8,
          同比变化: 0
        },
        {
          类型: 'II类',
          占比: 29.3,
          同比变化: 8.2
        },
        {
          类型: 'III类',
          占比: 67.7,
          同比变化: -5.2
        },
        {
          类型: 'IV类',
          占比: 0.8,
          同比变化: -4.5
        },
        {
          类型: 'V类',
          占比: 1.5,
          同比变化: 1.5
        },
        {
          类型: '劣V类',
          占比: 0,
          同比变化: 0
        }
      ]
    },
    {
      isEnglish: false,
      text: `2021年,324个地级及以上城市区域昼间等效声级平均值为54.1分贝。16个城市区域昼间环境噪声总体水平为一级,占4.9%;200个城市为二级,占61.7%;102个城市为三级,占31.5%;6个城市为四级,占1.9%;无五级城市。`,
      fieldInfo: [
        {
          fieldName: '噪声水平',
          fieldType: 'string',
          description: 'noise level'
        },
        {
          fieldName: '城市个数',
          fieldType: 'number',
          description: 'number of cities'
        },
        {
          fieldName: '占比',
          fieldType: 'number',
          description: 'percentage'
        }
      ],
      dataTable: [
        {
          噪声水平: '一级',
          城市个数: 16,
          占比: 4.9
        },
        {
          噪声水平: '二级',
          城市个数: 200,
          占比: 61.7
        },
        {
          噪声水平: '三级',
          城市个数: 102,
          占比: 31.5
        },
        {
          噪声水平: '四级',
          城市个数: 6,
          占比: 1.9
        },
        {
          噪声水平: '五级',
          城市个数: 0,
          占比: 0
        }
      ]
    }
  ]
};

const cultureSportsData = {
  domain: 'culture&&Sports',
  data: [
    {
      dataTable: [
        {
          年龄段: '00后',
          占比: 43.7
        },
        {
          年龄段: '90后',
          占比: 53.6
        },
        {
          年龄段: '80后',
          占比: 2.7
        }
      ],
      fieldInfo: [
        {
          fieldName: '年龄段',
          description: '运动员的年龄段',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '各年龄段运动员占比',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '今年的奥运赛场上，“00 后”已经快顶住中国奥运的半边天——43.7%都是 00 后，53.6%是 90 后，2.7%是 80 后。其中，年纪最小的是 11 岁的中国滑板选手郑好好，和她相差 38 岁的英国选手安迪·麦克唐纳（Andy Macdonald）也“滑”进了奥运会，成为史上最年长的奥运滑板项目参赛者。'
    },
    {
      dataTable: [
        {
          年份: '2012',
          体育产业总规模: 952600000000,
          体育产业增加值: 313600000000
        },
        {
          年份: '2021',
          体育产业总规模: 3118000000000,
          体育产业增加值: 1225000000000
        },
        {
          年份: '2022',
          体育产业总规模: 3300800000000,
          体育产业增加值: 1309200000000
        }
      ],
      fieldInfo: [
        {
          fieldName: '年份',
          description: '数据对应的年份',
          fieldType: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '体育产业总规模',
          description: '体育产业的总规模',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '体育产业增加值',
          description: '体育产业的增加值',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '2012 - 2022 年，我国体育产业总规模、增加值分别由 9526 亿元、3136 亿元增加至 3.3 万亿元、1.3 万亿元。2022 年全国体育产业总规模（总产出）为 33008 亿元，实现增加值 13092 亿元，与 2021 年相比，增长分别达到 5.9% 和 6.9%。'
    },
    {
      dataTable: [
        {
          省份: '四川',
          运动员人数: 28,
          大项数量: 11,
          小项数量: 19,
          金牌数: 5,
          银牌数: 13,
          铜牌数: 1,
          最佳成绩: '是'
        }
      ],
      fieldInfo: [
        {
          fieldName: '省份',
          description: '运动员所属省份',
          fieldType: 'region',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '运动员人数',
          description: '参加奥运会的运动员人数',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '大项数量',
          description: '参加的大项数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '小项数量',
          description: '参加的小项数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '金牌数',
          description: '获得的金牌数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '银牌数',
          description: '获得的银牌数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '铜牌数',
          description: '获得的铜牌数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '最佳成绩',
          description: '是否创造了历届奥运会参赛最佳成绩',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        }
      ],
      text: '28 名四川运动员参加了 11 个大项 19 个小项的角逐，5 人夺金、13 人次摘银，1 人获得铜牌，创造了历届奥运会参赛最佳成绩。'
    },
    {
      dataTable: [
        {
          球员: '孙铭徽',
          球队: '广厦男篮',
          数据类型: '得分',
          场均数据: 21
        },
        {
          球员: '原帅',
          球队: '山西男篮',
          数据类型: '得分',
          场均数据: 20.8
        },
        {
          球员: '胡金秋',
          球队: '广厦男篮',
          数据类型: '得分',
          场均数据: 20.8
        },
        {
          球员: '林葳',
          球队: '同曦男篮',
          数据类型: '得分',
          场均数据: 20
        },
        {
          球员: '周琦',
          球队: '广东男篮',
          数据类型: '篮板',
          场均数据: 11.7
        },
        {
          球员: '杨瀚森',
          球队: '青岛男篮',
          数据类型: '篮板',
          场均数据: 10.8
        },
        {
          球员: '王哲林',
          球队: '上海男篮',
          数据类型: '篮板',
          场均数据: 10.3
        },
        {
          球员: '阿不都沙拉木',
          球队: '新疆男篮',
          数据类型: '篮板',
          场均数据: 10.2
        },
        {
          球员: '孙铭徽',
          球队: '广厦男篮',
          数据类型: '助攻',
          场均数据: 10.6
        },
        {
          球员: '赵继伟',
          球队: '辽宁男篮',
          数据类型: '助攻',
          场均数据: 8.6
        },
        {
          球员: '阿尔斯兰',
          球队: '新疆男篮',
          数据类型: '助攻',
          场均数据: 8.1
        },
        {
          球员: '高诗岩',
          球队: '山东男篮',
          数据类型: '助攻',
          场均数据: 7.8
        },
        {
          球员: '陈盈骏',
          球队: '广州男篮',
          数据类型: '助攻',
          场均数据: 6.7
        }
      ],
      fieldInfo: [
        {
          fieldName: '球员',
          description: '球员姓名',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '球队',
          description: '球员所属球队',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '数据类型',
          description: '球员数据类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '场均数据',
          description: '球员场均数据',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '在 2023-2024 赛季 cba 常规赛结束的最后一轮比赛后，本赛季 cba 常规赛也落下了帷幕。广厦男篮球员孙铭徽以场均 21 分领跑本土球员得分榜，广东男篮球员以场均 11.7 个篮板领跑本土球员篮板榜，本土球员场均助攻最多的同样也是孙铭徽，他场均可以送出 10.6 个助攻。cba 本土球员数据榜：得分 —— 孙铭徽（广厦男篮）：场均 21 分；原帅（山西男篮）：场均 20.8 分；胡金秋（广厦男篮）：场均 20.8 分；林葳（同曦男篮）：场均 20 分。篮板 ——1、周琦（广东男篮）：场均篮板 11.7 个；2、杨瀚森（青岛男篮）：场均篮板 10.8 个；3、王哲林（上海男篮）：场均篮板 10.3 个；4、阿不都沙拉木（新疆男篮）：场均篮板 10.2 个。助攻 ——1、孙铭徽（广厦男篮）：场均助攻 10.6 次；2、赵继伟（辽宁男篮）：场均助攻 8.6 次；3、阿尔斯兰（新疆男篮）：场均助攻 8.1 次；4、高诗岩（山东男篮）：场均助攻 7.8 次；5、陈盈骏（广州男篮）：场均助攻 6.7 次。'
    },
    {
      dataTable: [
        {
          球星: '凯文・威利斯',
          年龄: 44,
          出场次数: 5,
          场均得分: 2.4,
          场均篮板: 1.6,
          场均助攻: null
        },
        {
          球星: '加内特',
          年龄: 39,
          出场次数: 38,
          场均得分: 3.2,
          场均篮板: 3.9,
          场均助攻: 1.6
        },
        {
          球星: '帕里什',
          年龄: null,
          出场次数: 43,
          场均得分: 3.7,
          场均篮板: 2.1,
          场均助攻: null
        },
        {
          球星: '诺维斯基',
          年龄: null,
          出场次数: 51,
          场均得分: 7.3,
          场均篮板: 3.1,
          场均助攻: null
        },
        {
          球星: '卡特',
          年龄: null,
          出场次数: 76,
          场均得分: 7.4,
          场均篮板: 2.6,
          场均助攻: null
        },
        {
          球星: '詹姆斯',
          年龄: null,
          出场次数: 71,
          场均得分: 25.7,
          场均篮板: 7.3,
          场均助攻: 8.3
        }
      ],
      fieldInfo: [
        {
          fieldName: '球星',
          description: '球星姓名',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '年龄',
          description: '球星在第21个赛季的年龄',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '出场次数',
          description: '球星在第21个赛季的出场次数',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '场均得分',
          description: '球星在第21个赛季的场均得分',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '场均篮板',
          description: '球星在第21个赛季的场均篮板',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '场均助攻',
          description: '球星在第21个赛季的场均助攻',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '美媒 clutchpoints 在社交媒体上晒出了一组数据，主要内容是对比 6 位球星在生涯第 21 个赛季的发挥，其中凯文・威利斯，他生涯第 21 个赛季已经 44 岁了，那个赛季只打了 5 场比赛，场均拿到 2.4 分 1.6 篮板的数据；加内特在 39 岁迎来了生涯第 21 个赛季，出战 38 场比赛，拿到 3.2 分 3.9 篮板 1.6 助攻；帕里什则出战 43 场，能够拿到 3.7 分 2.1 篮板；诺维斯基在第 21 个赛季打了 51 场比赛，能够拿到 7.3 分 3.1 篮板；卡特出战 76 场比赛，能够拿到 7.4 分 2.6 篮板。而詹姆斯在上个赛季能够拿到场均 25.7 分 7.3 篮板 8.3 助攻的全面数据，出战了 71 场比赛。'
    },
    {
      dataTable: [
        {
          同比增长: 21.8,
          行业类别: '新闻信息服务',
          行业营业收入: 984700000000,
          行业同比增长: 22.1,
          两年平均增长: 19.5
        },
        {
          同比增长: 21.8,
          行业类别: '内容创作生产',
          行业营业收入: 1769300000000,
          行业同比增长: 18.6,
          两年平均增长: 11.1
        },
        {
          同比增长: 21.8,
          行业类别: '创意设计服务',
          行业营业收入: 1378700000000,
          行业同比增长: 24,
          两年平均增长: 16.3
        },
        {
          同比增长: 21.8,
          行业类别: '文化传播渠道',
          行业营业收入: 930900000000,
          行业同比增长: 30.1,
          两年平均增长: 4.2
        },
        {
          同比增长: 21.8,
          行业类别: '文化投资运营',
          行业营业收入: 35900000000,
          行业同比增长: 13.8,
          两年平均增长: 6.8
        },
        {
          同比增长: 21.8,
          行业类别: '文化娱乐休闲服务',
          行业营业收入: 91600000000,
          行业同比增长: 35.3,
          两年平均增长: -9.9
        },
        {
          同比增长: 21.8,
          行业类别: '文化辅助生产和中介服务',
          行业营业收入: 1144100000000,
          行业同比增长: 18.3,
          两年平均增长: 3.5
        },
        {
          同比增长: 21.8,
          行业类别: '文化装备生产',
          行业营业收入: 488000000000,
          行业同比增长: 17.8,
          两年平均增长: 6.7
        },
        {
          同比增长: 21.8,
          行业类别: '文化消费终端生产',
          行业营业收入: 1597400000000,
          行业同比增长: 22,
          两年平均增长: 10.9
        }
      ],
      fieldInfo: [
        {
          fieldName: '同比增长',
          description: '全国规模以上文化及相关产业企业营业收入同比增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '行业类别',
          description: '具体行业类别',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '行业营业收入',
          description: '具体行业的营业收入',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '行业同比增长',
          description: '具体行业的营业收入同比增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '两年平均增长',
          description: '具体行业的营业收入两年平均增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '对全国 6.4 万家规模以上文化及相关产业企业调查，全国规模以上文化及相关产业企业实现营业收入 84205 亿元，比上年同期增长 21.8%。\n按行业类别划分，新闻信息服务营业收入 9847 亿元，比上年同期增长 22.1%，两年平均增长 19.5%；内容创作生产 17693 亿元，增长 18.6%，两年平均增长 11.1%；创意设计服务 13787 亿元，增长 24.0%，两年平均增长 16.3%；文化传播渠道 9309 亿元，增长 30.1%，两年平均增长 4.2%；文化投资运营 359 亿元，增长 13.8%，两年平均增长 6.8%；文化娱乐休闲服务 916 亿元，增长 35.3%，两年平均下降 9.9%；文化辅助生产和中介服务 11441 亿元，增长 18.3%，两年平均增长 3.5%；文化装备生产 4880 亿元，增长 17.8%，两年平均增长 6.7%；文化消费终端生产 15974 亿元，增长 22.0%，两年平均增长 10.9%。'
    },
    {
      dataTable: [
        {
          类型: '省份票房',
          地区: '四川省',
          排名: 5
        },
        {
          类型: '省份票房',
          地区: '广东省',
          排名: 1
        },
        {
          类型: '省份票房',
          地区: '江苏省',
          排名: 2
        },
        {
          类型: '省份票房',
          地区: '浙江省',
          排名: 3
        },
        {
          类型: '省份票房',
          地区: '山东省',
          排名: 4
        },
        {
          类型: '城市票房',
          地区: '成都市',
          排名: 5
        },
        {
          类型: '城市票房',
          地区: '北京市',
          排名: 1
        },
        {
          类型: '城市票房',
          地区: '上海市',
          排名: 2
        },
        {
          类型: '城市票房',
          地区: '深圳市',
          排名: 3
        },
        {
          类型: '城市票房',
          地区: '广州市',
          排名: 4
        }
      ],
      fieldInfo: [
        {
          fieldName: '类型',
          description: '票房统计类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '地区',
          description: '省份或城市名称',
          fieldType: 'region',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '排名',
          description: '票房排名',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '据猫眼专业版数据，截至 7 月 1 日 12 时，2024 上半年（2024 年 1 月 1 日 - 6 月 30 日）\n在省份票房方面，四川省上半年票房位列第五，广东省、江苏省、浙江省、山东省分列第一到第四。\n在城市票房方面，成都市上半年票房位列第五，北京市、上海市、深圳市、广州市分列第一到第四位。\n'
    },
    {
      dataTable: [
        {
          演出类型: '专业剧场',
          演出场次: 97400,
          与2019年相比增长: 31.09,
          票房收入: 8623000000,
          同比增长: 14.21,
          观演人数: 30642300,
          观演人数同比增长: 34.54
        },
        {
          演出类型: '小剧场和演艺新空间',
          演出场次: 186900,
          与2019年相比增长: 471.07,
          票房收入: 4803000000,
          同比增长: 463.13,
          观演人数: 24424000,
          观演人数同比增长: 250.54
        }
      ],
      fieldInfo: [
        {
          fieldName: '演出类型',
          description: '具体的演出类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '演出场次',
          description: '演出场次数量',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '与2019年相比增长',
          description: '与2019年相比的增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '票房收入',
          description: '票房收入金额',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比增长',
          description: '与去年同期相比的增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '观演人数',
          description: '观演人数数量',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '观演人数同比增长',
          description: '观演人数与去年同期相比的增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '具体的演出类型方面，专业剧场演出场次达到了9.74万场，与2019年相比增长了31.09%；票房收入为86.23亿元，同比增长了14.21%；观演人数为3064.23万人次，同比增长了34.54%。小剧场和演艺新空间（包括小型音乐现场Livehouse）的演出场次达到了18.69万场，与2019年相比增长了471.07%；票房收入为48.03亿元，同比增长了463.13%；观演人数为2442.40万人次，同比增长了250.54%。'
    },
    {
      dataTable: [
        {
          领域: '自然科学',
          语言: '英语',
          占比: 96.19
        },
        {
          领域: '社会科学',
          语言: '英语',
          占比: 96.17
        },
        {
          领域: '艺术与人文学科',
          语言: '英语',
          占比: 75.26
        },
        {
          领域: '自然科学',
          语言: '中文',
          占比: 0.0027
        },
        {
          领域: '社会科学',
          语言: '中文',
          占比: 0.0006
        },
        {
          领域: '艺术与人文学科',
          语言: '中文',
          占比: 0.0026
        }
      ],
      fieldInfo: [
        {
          fieldName: '领域',
          description: '学术论文的研究领域',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '语言',
          description: '学术论文使用的语言',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '学术论文使用该语言的比例',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '在国际学术论文的语言选择方面，英语占据了绝对的优势地位，自然科学领域的英文成果占比达到96.19%，而在社会科学和艺术与人文学科领域，英文成果的占比分别为96.17%和75.26%。中文在自然科学领域的国际学术论文中占比为0.0027%，在社会科学领域为0.0006%，在艺术与人文学科领域为0.0026%。这表明中文在国际学术界的使用相对较少，而英语是主要的学术交流语言'
    },
    {
      dataTable: [
        {
          国家或地区: '全球',
          世界遗产总数: 1154,
          世界文化遗产: 897,
          世界自然遗产: 218,
          世界文化与自然双重遗产: 39,
          占比: null
        },
        {
          国家或地区: '中国',
          世界遗产总数: 56,
          世界文化遗产: 39,
          世界自然遗产: 14,
          世界文化与自然双重遗产: 4,
          占比: 4.9
        }
      ],
      fieldInfo: [
        {
          fieldName: '国家或地区',
          description: '国家或地区名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '世界遗产总数',
          description: '世界遗产的总数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '世界文化遗产',
          description: '世界文化遗产的数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '世界自然遗产',
          description: '世界自然遗产的数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '世界文化与自然双重遗产',
          description: '世界文化与自然双重遗产的数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '占比',
          description: '世界遗产占比',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '截至 2022 年 6 月 10 日，联合国教科文组织官网显示世界遗产总数有 1154 个，分布在 167 个国家和地区。其中世界文化遗产 897 个，世界自然遗产 218 个，世界文化与自然双重遗产 39 个。中国有 56 个世界遗产，占比为 4.9%，包括 39 个世界文化遗产，14 个世界自然遗产以及 4 个世界文化与自然双重遗产。'
    }
  ]
};

const agricultureData = {
  domain: 'agriculture',
  data: [
    {
      isEnglish: false,
      dataTable: [
        {
          指标: '农林牧渔业总产值',
          年份: '2023',
          数值: 158507,
          单位: '亿元'
        },
        {
          指标: '农林牧渔业总产值',
          年份: '1952',
          数值: 461,
          单位: '亿元'
        },
        {
          指标: '年均增长',
          年份: '1953-2023',
          数值: 4.5,
          单位: '%'
        },
        {
          指标: '年均增长',
          年份: '1979-2023',
          数值: 5.5,
          单位: '%'
        },
        {
          指标: '年均增长',
          年份: '1953-1978',
          数值: 2.8,
          单位: '%'
        },
        {
          指标: '农业年均增速',
          年份: '1953-2023',
          数值: 3.8,
          单位: '%'
        },
        {
          指标: '林业年均增速',
          年份: '1953-2023',
          数值: 6.7,
          单位: '%'
        },
        {
          指标: '牧业年均增速',
          年份: '1953-2023',
          数值: 5.6,
          单位: '%'
        },
        {
          指标: '渔业年均增速',
          年份: '1953-2023',
          数值: 8.7,
          单位: '%'
        },
        {
          指标: '农林牧渔专业及辅助性活动年均增速',
          年份: '2004-2023',
          数值: 7.5,
          单位: '%'
        }
      ],
      fieldInfo: [
        {
          fieldName: '指标',
          description: '具体指标名称',
          fieldType: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份或范围',
          fieldType: 'string'
        },
        {
          fieldName: '数值',
          description: '具体数值',
          fieldType: 'number'
        },
        {
          fieldName: '单位',
          description: '数值的单位',
          fieldType: 'string'
        }
      ],
      text: '新中国成立以来，随着农业的蓬勃发展，我国农林牧渔业总产值实现较快增长。2023年，我国农林牧渔业总产值([1])158507亿元（当年价，下同），比1952年的461亿元增加158046亿元。按可比价格计算，1953-2023年年均增长4.5%。其中，改革开放以来（1979—2023年）农林牧渔业总产值年均增长5.5%，比改革开放以前（1953—1978年）年均增速提高2.7个百分点。分产业看，农林牧渔各业均保持稳定增长，1953-2023年农业、林业、牧业、渔业年均增速分别为3.8%、6.7%、5.6%、8.7%，2004-2023年农林牧渔专业及辅助性活动总产值年均增速为7.5%，农业经济稳步提升。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          指标: '农业产值占总产值比重',
          年份: '1952',
          比重: 85.9,
          单位: '%'
        },
        {
          指标: '林业产值占总产值比重',
          年份: '1952',
          比重: 1.6,
          单位: '%'
        },
        {
          指标: '牧业产值占总产值比重',
          年份: '1952',
          比重: 11.2,
          单位: '%'
        },
        {
          指标: '渔业产值占总产值比重',
          年份: '1952',
          比重: 1.3,
          单位: '%'
        },
        {
          指标: '农业产值占总产值比重',
          年份: '2023',
          比重: 54.9,
          单位: '%'
        },
        {
          指标: '林业产值占总产值比重',
          年份: '2023',
          比重: 4.4,
          单位: '%'
        },
        {
          指标: '牧业产值占总产值比重',
          年份: '2023',
          比重: 24.6,
          单位: '%'
        },
        {
          指标: '渔业产值占总产值比重',
          年份: '2023',
          比重: 10.2,
          单位: '%'
        },
        {
          指标: '比重变化（农业）',
          年份: '1952-2023',
          比重: -31.0,
          单位: '%'
        },
        {
          指标: '比重变化（林业）',
          年份: '1952-2023',
          比重: 2.8,
          单位: '%'
        },
        {
          指标: '比重变化（牧业）',
          年份: '1952-2023',
          比重: 13.4,
          单位: '%'
        },
        {
          指标: '比重变化（渔业）',
          年份: '1952-2023',
          比重: 8.9,
          单位: '%'
        },
        {
          指标: '农林牧渔专业及辅助性活动占总产值比重',
          年份: '2023',
          比重: 5.9,
          单位: '%'
        }
      ],
      fieldInfo: [
        {
          fieldName: '指标',
          description: '具体指标名称',
          fieldType: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份或者年份范围',
          fieldType: 'string'
        },
        {
          fieldName: '比重',
          description: '各产业占总产值的比重/比重变化',
          fieldType: 'number'
        },
        {
          fieldName: '单位',
          description: '数值的单位',
          fieldType: 'string'
        }
      ],
      text: '新中国成立以来，随着农业生产方式的变革，我国农业生产实现了由“以种植业为主、以粮为纲”的高度单一结构向“农林牧渔全面、多元、协调发展”的历史转变，多元化食物供给体系加快构建。1952年，农业产值占农林牧渔业总产值的比重达85.9%，处于绝对主导地位，林业、牧业和渔业产值所占比重分别为1.6%、11.2%和1.3%。改革开放后，农林牧渔业加速发展，农林牧渔业结构逐步协调合理。2023年，农业产值占农林牧渔业总产值的比重为54.9%，比1952年下降31.0个百分点；林业、牧业、渔业分别占4.4%、24.6%、10.2%，分别提高2.8个、13.4个、8.9个百分点。农林牧渔专业及辅助性活动占农林牧渔业总产值的比重为5.9%，农业服务呈蓬勃发展态势。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          产业类型: '农业总产值',
          年份: '2018',
          产值: 11.358
        },
        {
          产业类型: '种植业',
          年份: '2018',
          产值: 6.145
        },
        {
          产业类型: '畜牧业',
          年份: '2018',
          产值: 2.87
        },
        {
          产业类型: '渔业',
          年份: '2018',
          产值: 1.213
        },
        {
          产业类型: '林业',
          年份: '2018',
          产值: 0.5433
        }
      ],
      fieldInfo: [
        {
          fieldName: '产业类型',
          description: '农业产业的具体类型',
          fieldType: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份',
          fieldType: 'date'
        },
        {
          fieldName: '产值',
          description: '产业产值',
          fieldType: 'number'
        }
      ],
      text: '2018年，在农产品消费增长的推动下，中国农业总产值达到11.358万亿元。根据国家统计局的定义，种植业即庄稼种植，其2018年产值为6.145万亿元，占农业总产值的54.1%；其次是畜牧业，产值为2.87万亿元，占比25.3%；渔业产值为1.213万亿元，林业产值为5,433亿元。但由于中国城镇化进程加速，第二、三产业快速发展，农业产值占国内生产总值的比重继续下降，从2017年的13.9%下降到2018年的12.6%，为1978年以来的最低水平。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          农产品类型: '夏粮',
          年份: '2018',
          产量: 13878
        },
        {
          农产品类型: '秋粮',
          年份: '2018',
          产量: 49052
        },
        {
          农产品类型: '早稻',
          年份: '2018',
          产量: 2859
        },
        {
          农产品类型: '棉花',
          年份: '2018',
          产量: 610
        },
        {
          农产品类型: '粮食',
          年份: '2018',
          产量: 65789
        },
        {
          农产品类型: '豆类',
          年份: '2018',
          产量: 1920
        },
        {
          农产品类型: '薯类',
          年份: '2018',
          产量: 2865
        },
        {
          农产品类型: '肉类',
          年份: '2018',
          产量: 8625
        },
        {
          农产品类型: '水产品',
          年份: '2018',
          产量: 6458
        }
      ],
      fieldInfo: [
        {
          fieldName: '农产品类型',
          description: '农产品的具体种类',
          fieldType: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份',
          fieldType: 'date'
        },
        {
          fieldName: '产量',
          description: '农产品产量',
          fieldType: 'number'
        }
      ],
      text: '2018年，夏粮产量13,878万吨，秋粮产量49,052万吨，早稻产量2,859万吨。棉花总产量610万吨。2018年，粮食、豆类、薯类产量分别为65,789万吨、1,920万吨、2,865万吨。近年来，由于人口收入增长和城市化进程，传统粮食生产已发生重大转变，蔬菜和水果在总产出中所占比重有所增加。2018年，肉类产量达到8,625万吨，水产品产量达到6,458万吨。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          整治项目: '建筑立面刷白',
          工程量: 145947.45
        },
        {
          整治项目: '清水砖墙面粉刷',
          工程量: 2760.28
        },
        {
          整治项目: '商铺店招修缮',
          工程量: 1339.07
        },
        {
          整治项目: '水泥压花',
          工程量: 43584.97
        },
        {
          整治项目: '屋前场地硬化',
          工程量: 19921.01
        },
        {
          整治项目: '池塘挡墙护坡',
          工程量: 1601.0
        },
        {
          整治项目: '道路护脚墙',
          工程量: 2993.72
        },
        {
          整治项目: '颐养之家提升',
          工程量: 1614.0
        },
        {
          整治项目: '菜园矮墙',
          工程量: 2119.19
        },
        {
          整治项目: '其他基础配套设施',
          工程量: 1
        }
      ],
      fieldInfo: [
        {
          fieldName: '整治项目',
          description: '村庄环境整治的具体项目',
          fieldType: 'string'
        },
        {
          fieldName: '工程量',
          description: '项目工程量',
          fieldType: 'number or string depending on content'
        }
      ],
      text: '村庄环境整治:建筑立面刷白145947.45平方米、清水砖墙面粉刷 2760.28平方米、商铺店招修缮1339.07平方米、水泥压花43584.97平方米、屋前场地硬化19921.01平方米、池塘挡墙护坡1601.00米、道路护脚墙2993.72米、颐养之家提升1614.00平方米、菜园矮墙2119.19米、其他基础配套设施1项。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          产品类别: '农业产品',
          价格变化幅度: -3.0
        },
        {
          产品类别: '林业产品',
          价格变化幅度: 2.6
        },
        {
          产品类别: '饲养动物及其产品',
          价格变化幅度: -4.4
        },
        {
          产品类别: '渔业产品',
          价格变化幅度: -2.9
        },
        {
          产品品种: '谷物',
          价格变化幅度: -4.8
        },
        {
          产品品种: '小麦',
          价格变化幅度: -2.5
        },
        {
          产品品种: '稻谷',
          价格变化幅度: 2.0
        },
        {
          产品品种: '玉米',
          价格变化幅度: -12.0
        },
        {
          产品品种: '油料',
          价格变化幅度: -2.7
        },
        {
          产品品种: '水果',
          价格变化幅度: -8.9
        },
        {
          产品品种: '蔬菜',
          价格变化幅度: -1.6
        },
        {
          产品品种: '生猪',
          价格变化幅度: 1.4
        },
        {
          产品品种: '活牛',
          价格变化幅度: -16.0
        },
        {
          产品品种: '活羊',
          价格变化幅度: -9.5
        },
        {
          产品品种: '活家禽',
          价格变化幅度: -3.3
        },
        {
          产品品种: '禽蛋',
          价格变化幅度: -10.6
        }
      ],
      fieldInfo: [
        {
          fieldName: '产品类别品种',
          description: '农产品的类别、品种',
          fieldType: 'string'
        },
        {
          fieldName: '价格变化幅度',
          description: '价格同比变化幅度',
          fieldType: 'ratio'
        }
      ],
      text: '上半年，全国农产品生产者价格总水平同比下降3.2%，其中，一季度下降3.9%，二季度下降2.9%。分类别看，农业产品价格同比下降3.0%，林业产品价格上涨2.6%，饲养动物及其产品价格下降4.4%，渔业产品价格下降2.9%。分品种看，谷物价格同比下降4.8%，其中，小麦下降2.5%，稻谷上涨2.0%，玉米下降12.0%；油料下降2.7%，水果下降8.9%，蔬菜下降1.6%；生猪上涨1.4%，活牛、活羊分别下降16.0%、9.5%，活家禽、禽蛋分别下降3.3%、10.6%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          指标名称: '2021 年全国数字乡村发展水平',
          数值: 39.1
        },
        {
          指标名称: '2021 年农业生产信息化率',
          数值: 25.4
        },
        {
          指标名称: '全国六类涉农政务服务事项综合在线办事率',
          数值: 68.2
        },
        {
          指标名称: '2022 年农村互联网普及率',
          数值: 58.8
        },
        {
          指标名称: '2022 年全国农村网络零售额',
          数值: 2.17
        }
      ],
      fieldInfo: [
        {
          fieldName: '指标名称',
          description: '数字乡村相关指标名称',
          fieldType: 'string'
        },
        {
          fieldName: '数值',
          description: '具体指标数值',
          fieldType: 'number or percentage depending on content'
        }
      ],
      text: '其间，中共中央、国务院出台《数字乡村发展战略纲要》，农业农村部、中央网信办联合制定《数字农业农村发展规划（2019—2025年）》。2024年，国家数据局等17部委联合印发《“数据要素×”三年行动计划（2024—2026年）》，指出要在现代农业等多个行业领域全面启动实施“数据要素×”三年行动。在数字中国发展战略和一系列政策支持下，我国数字农业、数字乡村建设取得积极进展。根据《中国数字乡村发展报告（2022年）》，2021年全国数字乡村发展水平达39.1%，农业生产信息化率为25.4%，全国六类涉农政务服务事项综合在线办事率达68.2%，以数据驱动的乡村治理水平不断提高。截至2022年6月，农村互联网普及率达58.8%，与“十三五”初期相比，城乡互联网普及率差距缩小近15个百分点。2022年利用信息化手段开展服务的村级综合服务站点共48.3万个，行政村覆盖率达86.0%；全国农村网络零售额达2.17万亿元，比上年增长3.6%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          指标名称: '农业数字经济占农业增加值比重',
          '2018 年数值': 7.3,
          '2025 年数值': 15,
          年均增速: 10.8
        },
        {
          指标名称: '农产品网络零售额占农产品总交易额比重',
          '2018 年数值': 9.8,
          '2025 年数值': 15,
          年均增速: 5.5
        },
        {
          指标名称: '农村互联网普及率',
          '2018 年数值': 38.4,
          '2025 年数值': 70,
          年均增速: 10.5
        }
      ],
      fieldInfo: [
        {
          fieldName: '指标名称',
          description: '不同的数字乡村相关指标名称',
          fieldType: 'string'
        },
        {
          fieldName: '2018 年数值',
          description: '2018 年对应指标数值',
          fieldType: 'percentage'
        },
        {
          fieldName: '2025 年数值',
          description: '2025 年对应指标数值',
          fieldType: 'percentage'
        },
        {
          fieldName: '年均增速',
          description: '对应指标的年均增长速度',
          fieldType: 'percentage'
        }
      ],
      text: `1.农业数字经济占农业增加值比重（%） 从2018年的7.3%到2025年的15%，年均增速10.8%
          2.农产品网络零售额占农产品总交易额比重（%） 从2018年的9.8%到2025年的15%，年均增速5.5%
          3.农村互联网普及率（%）从2018年的38.4%到2025年的70%，年均增速10.5%`
    },
    {
      isEnglish: false,
      dataTable: [
        {
          培育对象: '农民合作社带头人',
          '2023 年人数': 7.2
        },
        {
          培育对象: '家庭农场主',
          '2023 年人数': 12.9
        },
        {
          培育对象: '农业社会化服务组织带头人',
          '2023 年人数': 4.3
        },
        {
          培育对象: '农业企业负责人',
          '2023 年人数': 4.2
        },
        {
          培育对象: '农业职业经理人',
          '2023 年人数': 0.8
        },
        {
          培育对象: '农村电商带头人',
          '2023 年人数': 1.9
        },
        {
          培育对象: '脱贫区域产业带头人',
          '2023 年人数': 6.6
        },
        {
          培育对象: '返乡群体（大学毕业生、农民工和退役军人等）',
          '2023 年人数': 10.5
        },
        {
          培育对象: '学习‘三品一标’相关课程人员',
          '2023 年人数': 11.7
        },
        {
          培育对象: '学习冷链物流相关课程人员',
          '2023 年人数': 2.8
        }
      ],
      fieldInfo: [
        {
          fieldName: '培育对象',
          description: '不同的培训对象类别',
          fieldType: 'string'
        },
        {
          fieldName: '2023 年人数',
          description: '2023 年对应培育对象的人数',
          fieldType: 'number'
        }
      ],
      text: '2023年，各地培育农民合作社带头人7.2万人、家庭农场主12.9万人、农业社会化服务组织带头人4.3万人、农业企业负责人4.2万人；培养农业职业经理人0.8万人、农村电商带头人1.9万人；支持脱贫区域培育产业带头人近6.6万人；大学毕业生、农民工和退役军人等返乡群体10.5万人参加培训。针对产业发展急需短板环节，11.7万人学习了“三品一标”相关课程，2.8万人学习了冷链物流相关课程。'
    }
  ]
};

const retailData = {
  domain: 'retail',
  data: [
    {
      isEnglish: false,
      dataTable: [
        {
          年份: '2022',
          支出规模: 4306
        },
        {
          年份: '2027',
          支出规模: 9809
        }
      ],
      fieldInfo: [
        {
          fieldName: '年份',
          description: '具体年份',
          fieldType: 'date'
        },
        {
          fieldName: '支出规模',
          description: '中国零售行业大数据市场支出规模，单位为亿元人名币',
          fieldType: 'number'
        }
      ],
      text: '智通财经APP获悉，IDC于近日发布了《零售行业数据智能市场分析——以客户为主导的零售业的逆向体验》。报告显示，2023年，中国零售行业大数据市场支出规模达到4306亿元人民币，预计2027年将增长至9809亿元人民币，年均增长率CAGR为22.9%'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          品类: '酒水',
          整体搜索量环比: 0.48,
          年份: '2024年年初至1月12日'
        }
      ],
      fieldInfo: [
        {
          fieldName: '年份',
          description: '数据对应的年份',
          fieldType: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '品类',
          description: '商品品类',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '整体搜索量环比',
          description: '整体搜索量环比变化率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '一份来自多点DMALL的大数据显示，2024年年初至1月12日，酒水整体搜索量环比增长48%，生鲜品类销售量同比增长超30%，旺盛的数据背后对应的是春节期间消费者对消费逐渐回暖的需求。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          信息化市场类型: '硬件',
          产品类型: '计算机网络设备',
          占比: 45.67
        },
        {
          信息化市场类型: '硬件',
          产品类型: 'pos系统设备',
          占比: 11.92
        },
        {
          信息化市场类型: '硬件',
          产品类型: 'RFID系统设备',
          占比: 10.33
        },
        {
          信息化市场类型: '硬件',
          产品类型: '其他硬件产品',
          占比: 32.08
        },
        {
          信息化市场类型: '软件',
          产品类型: '资源管理ERP系统',
          占比: 44.27
        },
        {
          信息化市场类型: '软件',
          产品类型: '供应链管理（SCM）',
          占比: 15.78
        },
        {
          信息化市场类型: '软件',
          产品类型: '客户关系管理（CRM）',
          占比: 14.18
        },
        {
          信息化市场类型: '软件',
          产品类型: '其他软件',
          占比: 25.77
        }
      ],
      fieldInfo: [
        {
          fieldName: '信息化市场类型',
          description: '零售业信息化市场类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '产品类型',
          description: '零售业信息化产品类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '硬件占比',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '零售领域亦是如此。从零售业信息化硬件市场结构来看，计算机网络设备占比最重，占比为45.67%，其次为pos系统设备，占比为11.92%，RFID系统设备占比为，10.33%，其他硬件产品占比32.08%。从零售业信息化软件市场来看，资源管理ERP系统占比最重，占比为44.27%，其次为供应链管理（SCM）占比为15.78%，客户关系管理（CRM）占比为14.18%，其他软件占比为25.77%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          零售业态: '超市',
          零售额增长率: 0.903
        },
        {
          零售业态: '便利店',
          零售额增长率: -0.196
        },
        {
          零售业态: '百货店',
          零售额增长率: -0.162
        },
        {
          零售业态: '专业店',
          零售额增长率: -0.092
        },
        {
          零售业态: '专卖店',
          零售额增长率: -0.128
        }
      ],
      fieldInfo: [
        {
          fieldName: '零售业态',
          description: '零售业态类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '零售额增长率',
          description: '零售额比上年增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '按零售业态分，2022年中国限额以上零售业单位中的超市、便利店、百货店、专业店和专卖店零售额比上年分别增长90.3%、-19.6%、-16.2%、9.2%和-12.8%。超市成为增长最快的零售行业细分领域'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          销售规模: '超过1000亿元',
          企业数量: 5,
          同比变化: -0.042
        },
        {
          销售规模: '500亿元-1000亿元',
          企业数量: 8,
          同比变化: -0.026
        },
        {
          销售规模: '100亿元-500亿元',
          企业数量: 39,
          同比变化: -0.039
        },
        {
          销售规模: '100亿元以下',
          企业数量: 48,
          同比变化: -0.082
        }
      ],
      fieldInfo: [
        {
          fieldName: '销售规模',
          description: '百强企业企业的销售规模',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '企业数量',
          description: '企业的数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '销售规模的同比变化',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '根据中国商业联合会和中华全国商业信息中心的统计数据，2022年中国商业零售百强企业的销售规模为3.3万亿元，同比下降了4.2%(按可比口径计算)，与社会消费品零售总额增速相比，百强企业增速低于社会消费品零售总额增速4.0个百分点。从销售规模分布来看，超过1000亿元销售规模的企业有5家，销售规模同比下降4.2%。超过500亿元的企业有8家，销售规模同比下降2.6%。在100亿到500亿元之间的有39家企业，销售规模同比下降3.9%。销售规模100亿元以下的企业有48家，销售规模同比下降8.2%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          价格区间: '25-30万',
          销量最高车型: '特斯拉Model Y',
          销量最高车型销量份额: 0.614,
          销量前三车型销量份额: 0.82
        },
        {
          价格区间: '20-25万',
          销量最高车型: '特斯拉Model 3',
          销量最高车型销量份额: null,
          销量前三车型销量份额: 0.58
        }
      ],
      fieldInfo: [
        {
          fieldName: '价格区间',
          description: '价格区间',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销量最高车型',
          description: '车型名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销量最高车型销量份额',
          description: '销量份额',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '销量前三车型销量份额',
          description: '销量份额',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '20-25万、25-30万元价格区间是电动车占比高于传统燃料车型的细分市场，也是国内新势力重点布局的两个细分市场。2023年8月，25-30万元价格区间是电动车销量增幅较大的细分市场，到了2024年8月，这一市场同比仅增长4.8%；经过一年的价格博弈，20-25万成为今年销量增幅较大的细分市场；虽然销量同比增长了25%，但是包括油车在内共有77款车型参与竞争，部分车型是通过降价进入到这个细分市场，也有这个细分市场车型通过降价进入了下一个价格区间。另外，观察这两个细分市场的电动车型销量，25-30万元价格区间，特斯拉Model Y占据了61.4%的市场份额，销量前三车型占82%的销量份额；20-25万价格区间，小米SU7作为新车型销量仅次于特斯拉Model 3，说明已经受到市场认可；这一市场销量前三的车型，占该市场份额的58%；正是这种销量过度集中，导致市场竞争激烈，建议销量居后的车型需要考虑重新调整产品和定价，脱离这一细分市场，寻找可以生存的空间。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          月份: '2024-06',
          发展指数: '1151',
          环比变化: -66,
          同比变化: -0.06
        }
      ],
      fieldInfo: [
        {
          fieldName: '月份',
          description: '具体月份',
          fieldType: 'date',
          dateGranularity: 'month',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '发展指数',
          description: '中国零售药店发展指数',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '环比变化',
          description: '发展指数环比变化',
          fieldType: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '发展指数同比变化',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '6月为我国零售药店行业的销售淡季。数据显示，2024年6月中国零售药店发展指数环比下降66点，达1,151点；与去年同期相比，6月发展指数同比下降6.0%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          企业类型: '电商企业',
          企业数量: 8
        },
        {
          企业类型: '实体零售企业',
          企业数量: 47
        },
        {
          企业类型: '消费品企业',
          企业数量: 45
        }
      ],
      fieldInfo: [
        {
          fieldName: '企业类型',
          description: '企业所属类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '企业数量',
          description: '各类型企业数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '本次榜单上榜企业包括电商企业8家、实体零售企业47家、消费品企业45家;排名前三的企业依次为京东、阿里巴巴和唯品会，3家企业网络销售规模均超千亿元，较上年分别增长0.7%、6.4%和8.6%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          商业模式: 'O2O平台',
          占比: 35
        },
        {
          商业模式: '社区团购',
          占比: 35
        },
        {
          商业模式: '前置仓',
          占比: 15
        },
        {
          商业模式: '其他',
          占比: 15
        }
      ],
      fieldInfo: [
        {
          fieldName: '商业模式',
          description: '生鲜零售线上商业模式',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '商业模式占比',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '中国生鲜零售线上商业模式主要为O2O平台、前置仓、社区团购和其他，根据数据显示，占比最重的商业模式为O2O平台和社区团购，分别占比35%，其次前置仓占比15%，其他占比15%。'
    },
    {
      dataTable: [
        {
          商品类别: '粮油食品类',
          零售额同比增速: 0.099
        },
        {
          商品类别: '饮料类',
          零售额同比增速: 0.061
        },
        {
          商品类别: '中西药品类',
          零售额同比增速: 0.058
        },
        {
          商品类别: '通讯器材类',
          零售额同比增速: 0.127
        },
        {
          商品类别: '体育娱乐用品类',
          零售额同比增速: 0.107
        }
      ],
      fieldInfo: [
        {
          fieldName: '商品类别',
          description: '商品的具体类别',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '零售额同比增速',
          description: '商品零售额与去年同期相比的增长速度',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '7月份，在限额以上单位18个商品类别中，10类商品零售额同比增速回升。基本生活类商品零售保持较好增势，限额以上单位粮油食品类、饮料类、中西药品类商品零售额同比分别增长9.9%、6.1%和5.8%。手机新品发布、体育健身活动升温带动相关商品销售较快增长，限额以上单位通讯器材类零售额同比增长12.7%，比6月份加快9.8个百分点，体育娱乐用品类零售额增长10.7%，6月份为下降1.5%。'
    }
  ]
};

const travelData = {
  domain: 'travel',
  data: [
    {
      isEnglish: false,
      fieldInfo: [
        {
          fieldName: '铁路局',
          description: '铁路局集团公司名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '增开旅客列车',
          description: '增开的旅客列车数量',
          fieldType: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '方向',
          description: '热门方向',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        }
      ],
      dataTable: [
        {
          铁路局: '沈阳局集团公司',
          增开旅客列车: 115
        },
        {
          铁路局: '北京局集团公司',
          增开旅客列车: 144,
          方向: ['沈阳', '长春', '上海', '郑州', '广州', '西安']
        },
        {
          铁路局: '太原局集团公司',
          增开旅客列车: 154,
          方向: ['太原', '北京', '西安']
        },
        {
          铁路局: '呼和局集团公司',
          增开旅客列车: 45,
          方向: ['呼和浩特', '北京']
        },
        {
          铁路局: '郑州局集团公司',
          增开旅客列车: 48,
          方向: ['郑州', '洛阳', '北京', '广州', '上海']
        },
        {
          铁路局: '武汉局集团公司',
          增开旅客列车: 106
        },
        {
          铁路局: '西安局集团公司',
          增开旅客列车: 103,
          方向: ['北京', '成都', '重庆', '兰州', '银川', '管内']
        },
        {
          铁路局: '上海局集团公司',
          增开旅客列车: 207,
          方向: ['郑州', '西安', '武汉', '长沙', '南昌', '长三角区域内热门线路']
        },
        {
          铁路局: '南昌局集团公司',
          增开旅客列车: 207,
          方向: ['南昌', '福州', '厦门前往长三角', '珠三角', '湖南', '湖北']
        },
        {
          铁路局: '广州局集团公司',
          增开旅客列车: 223,
          方向: ['广州', '深圳', '湖南省内城市至长沙']
        },
        {
          铁路局: '南宁局集团公司',
          增开旅客列车: 90
        },
        {
          铁路局: '成都局集团公司',
          增开旅客列车: 12,
          方向: ['川青铁路新线']
        },
        {
          铁路局: '兰州局集团公司',
          增开旅客列车: 18,
          方向: ['兰州至西安', '银川', '天水']
        }
      ],
      text: '各地铁路部门积极应对返程客流高峰，精准灵活增加运力投放，最大限度满足旅客出行需求。沈阳局集团公司增开旅客列车115列，安排动车组列车重联112列，加挂普速旅客列车车厢125辆，始发席位能力增至48.9万个；北京局集团公司增开北京至沈阳、长春、上海、郑州、广州、西安等热门方向旅客列车144列；太原局集团公司增开太原、大同至北京、西安等方向旅客列车154列，增加始发席位能力6.4万个；呼和局集团公司在呼和浩特、包头至北京等热门方向增开旅客列车27列、重联动车组18列；郑州局集团公司增开郑州、洛阳、商丘至北京、广州、上海等热门方向旅客列车48列；武汉局集团公司在汉宜铁路、汉十高铁、郑渝高铁等热门线路加开旅客列车106列；西安局集团公司增开西安至北京、成都、重庆、兰州、银川等方向及管内旅客列车103列；上海局集团公司增开上海至郑州、西安、武汉、长沙、南昌等城市及长三角区域内热门线路旅客列车207列；南昌局集团公司加开南昌、福州、厦门前往长三角、珠三角、湖南、湖北等地区及往返周边城市旅客列车207列；广州局集团公司加开广东省内城市至广州、深圳，湖南省内城市至长沙等方向旅客列车223列；南宁局集团公司加开夜间高铁19列、安排71列动车组列车重联运行；成都局集团公司用好川青铁路新线运能，增开12列动车组列车，将黄龙九寨站最后一趟动车组列车发车时间延后至23时48分，方便游客返程；兰州局集团公司加开兰州至西安、银川、天水等热门方向动车组列车18列，安排普速旅客列车加挂车厢60辆；青藏铁路公司加开西宁至格尔木（门源）、拉萨至日喀则等方向动车组列车。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          产品: '国内游度假产品',
          同比: 51
        },
        {
          产品: '品牌门店',
          同比: 69
        },
        {
          产品: '私家团',
          同比: 104
        }
      ],
      fieldInfo: [
        {
          fieldName: '产品',
          description: '携程的产品或业务类型',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '同比',
          description: '交易额Year-on-year-Growth率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '目前正值双11期间，携程各项产品和业务均迎来较快增长。携程发布的双11狂欢节战报显示，11月11日0:00-24:00，携程国内游度假产品交易额同比增长51%；旗下品牌门店销售额超3300万，同比增长69%；私家团同比增长104%，平均订单消费超过9000元。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          国家: '希腊',
          GDP增长率: 2.2
        },
        {
          国家: '西班牙',
          GDP增长率: 2.1
        },
        {
          国家: '葡萄牙',
          GDP增长率: 1.7
        },
        {
          国家: '意大利',
          GDP增长率: 0.9
        },
        {
          国家: '欧元区',
          GDP增长率: 0.8
        },
        {
          国家: '德国',
          GDP增长率: 0.1
        }
      ],
      fieldInfo: [
        {
          fieldName: '国家',
          description: '国家名称',
          fieldType: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: 'GDP',
          description: '国内生产总值增长率',
          fieldType: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '受旅游业的刺激，曾在欧债危机中困难重重的希腊、西班牙、葡萄牙和意大利经济，正凭借强劲的增长一跃成为欧元区的“优等生”。根据欧盟委员会的预测，2024年，这四国的国内生产总值（GDP）增长率分别为2.2%、2.1%、1.7%和0.9%，均高于欧元区0.8%的增长幅度。相比之下，德国仅有0.1%'
    }
  ]
};

export const dataExtractionCommonDataset = [
  economyData,
  technologyData,
  // realEstateData,
  enviromentData,
  cultureSportsData,
  agricultureData,
  retailData,
  travelData
].reduce((prev: Record<string, any>[], cureV) => {
  return [
    ...prev,
    ...cureV.data.map(v => ({
      ...v,
      domain: cureV.domain
    }))
  ];
}, []);

export const commonAnswer: DataExtractionCase = {
  llm: 'answer',
  result: [
    {
      dataset: 'common',
      defaultResult: dataExtractionCommonDataset.map(v => ({
        context: v
      })) as any,
      fieldInfoResult: []
    }
  ]
};
