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
          type: 'date',
          dateGranularity: 'day',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '汇率类型',
          description: '汇率的类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '汇率',
          description: '人民币对美元的汇率',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '较前一交易日升值',
          description: '较前一交易日升值的基点数',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '单日涨幅',
          description: '单日涨幅百分比',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '指数',
          description: '指数名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '个股',
          description: '指数名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '涨幅',
          description: '指数涨幅',
          type: 'ratio',
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
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '比较资产',
          description: '与黄金收益率比较的资产',
          type: 'string',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '资产规模',
          description: '银行的资产规模',
          type: 'numerical',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '增速',
          description: '银行的同比增速',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '初始金额',
          description: '初始金额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '最终金额',
          description: '最终金额',
          type: 'numerical',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '不良率',
          description: '银行的不良贷款率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '不良率的同比变化',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '信托类型',
          description: '信托产品的类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '成立个数',
          description: '信托产品的成立个数',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '成立规模',
          description: '信托产品的成立规模',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '规模占比',
          description: '信托产品的规模占比',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: 'LPR期限',
          description: '贷款市场报价利率的期限',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '基点变化',
          description: 'LPR基点变化',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '调整后LPR',
          description: '调整后的LPR值',
          type: 'numerical',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '国债收益率',
          description: '10年期国债收益率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '备注',
          description: '相关备注信息',
          type: 'string',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '利率调整前',
          description: '调整前的利率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '利率调整后',
          description: '调整后的利率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '基点变化',
          description: '利率变化的基点数',
          type: 'numerical',
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
          type: 'string'
        },
        {
          fieldName: '起售价',
          description: '手机起售价',
          type: 'numerical'
        },
        {
          fieldName: '屏幕尺寸',
          description: '手机屏幕尺寸',
          type: 'numerical'
        },
        {
          fieldName: '芯片',
          description: '手机芯片配置',
          type: 'string'
        },
        {
          fieldName: '电池容量',
          description: '手机电池容量的大小',
          type: 'numerical'
        },
        {
          fieldName: '有线快充',
          description: '手机快充瓦数',
          type: 'numerical'
        },
        {
          fieldName: '自拍镜头像素',
          description: '手机自拍镜头像素',
          type: 'numerical'
        },
        {
          fieldName: '后置摄像头数量',
          description: '后置摄像头数量',
          type: 'numerical'
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
          type: 'date',
          dateGranularity: 'year'
        },
        {
          fieldName: '论文数量',
          description: '收录的科研论文数量',
          type: 'numerical'
        },
        {
          fieldName: '检索工具',
          description: '科研论文检索工具',
          type: 'string'
        },
        {
          fieldName: '世界排名',
          description: '科研论文数量排名',
          type: 'numerical'
        },
        {
          fieldName: '发明专利授权数',
          description: '发明专利授权数',
          type: 'numerical'
        },
        {
          fieldName: '发明专利授权占比',
          description: '发明专利授权占比',
          type: 'ratio'
        },
        {
          fieldName: '境内发明专利有效量',
          description: '境内发明专利有效量',
          type: 'numerical'
        },
        {
          fieldName: '每万人口高价值发明专利拥有量',
          description: '每万人口高价值发明专利拥有量',
          type: 'numerical'
        }
      ]
    },
    {
      isEnglish: false,
      text: '受数据源更新的影响，记者主要以8月数据为基础，分析国产C级车市场的现状。8月，国产C级车的累计销量为92398辆，环比上个月上涨29.01%。其中，燃油车和新能源车的销量之和分别为31112辆、61286辆，在C级车总销量中的占比分别为33.67%、66.33%。',
      dataTable: [
        {
          月份: '8月',
          车类型: '燃油车',
          销量: 31112,
          环比增长率: null,
          在总销量中占比: 33.67
        },
        {
          月份: '8月',
          车类型: '新能源车',
          销量: 61286,
          环比增长率: null,
          在总销量中占比: 66.33
        },
        {
          月份: '8月',
          车类型: '国产C级车',
          销量: 92398,
          环比增长率: 29.01,
          在总销量中占比: null
        }
      ],
      fieldInfo: [
        {
          fieldName: '月份',
          description: '数据对应的月份',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '车类型',
          description: '车辆类型，包括燃油车和新能源车',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销量',
          description: '车辆的销售数量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '环比增长率',
          description: '与上个月相比的销售增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '在总销量中占比',
          description: '某类型车在C级车总销量中的比例',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
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
          type: 'string'
        },
        {
          fieldName: '车型',
          description: '具体车型',
          type: 'string'
        },
        {
          fieldName: '月份',
          description: '具体月份',
          type: 'date',
          dateGranularity: 'month'
        },
        {
          fieldName: '销量',
          description: '单月销量',
          type: 'numerical'
        },
        {
          fieldName: '累计销量',
          description: '今年前8个月的累计销量',
          type: 'numerical'
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
          type: 'string'
        },
        {
          fieldName: '销量',
          description: '汽车的销量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '梯队',
          description: '汽车所在的梯队',
          type: 'string'
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
          type: 'string'
        },
        {
          fieldName: '售价',
          description: '商品原售价',
          type: 'numerical'
        },
        {
          fieldName: '门店优惠',
          description: '门店优惠金额',
          type: 'numerical'
        },
        {
          fieldName: '政府补贴',
          description: '政府补贴金额',
          type: 'numerical'
        },
        {
          fieldName: '最终价格',
          description: '最终到手价格',
          type: 'numerical'
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
          type: 'string'
        },
        {
          fieldName: '点频速率',
          description: '点频速率',
          type: 'numerical'
        },
        {
          fieldName: '最远探测距离',
          description: '最远探测距离',
          type: 'numerical'
        },
        {
          fieldName: '最小角分辨率',
          description: '最小角分辨率',
          type: 'numerical'
        },
        {
          fieldName: '视野覆盖角度',
          description: '视野覆盖的角度',
          type: 'numerical'
        },
        {
          fieldName: '零部件数量',
          description: '零部件数量具体减少的百分比',
          type: 'ratio'
        },
        {
          fieldName: '生产工序时间',
          description: '生产工序时间具体缩短的百分比',
          type: 'ratio'
        },
        {
          fieldName: '核心工序自动化率',
          description: '核心工序自动化率百分比',
          type: 'ratio'
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
          type: 'numerical'
        },
        {
          fieldName: '音乐用户占比',
          description: '音乐用护用在网民整体中的总占比',
          type: 'ratio'
        },
        {
          fieldName: '男性占比',
          description: '男性在音乐用户规模中的总占比',
          type: 'ratio'
        },
        {
          fieldName: '女性占比',
          description: '女性在音乐用户规模中的总占比',
          type: 'ratio'
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
          type: 'string'
        },
        {
          fieldName: 'web pages number',
          description: 'the number of web pages',
          type: 'numerical'
        },
        {
          fieldName: 'books number',
          description: 'the number of books',
          type: 'numerical'
        },
        {
          fieldName: 'videos of films and television programmes number',
          description: 'the number of videos of films and television programmes',
          type: 'numerical'
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
          type: 'date',
          dateGranularity: 'year'
        },
        {
          fieldName: 'product',
          description: 'the name of product',
          type: 'string'
        },
        {
          fieldName: 'price',
          description: 'The price of the product',
          type: 'numerical'
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
          fieldName: '年份',
          description: '数据对应的年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '全国GDP',
          description: '全国国内生产总值',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '全国GDP同比',
          description: '全国GDP同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '全国房地产开发投资',
          description: '全国房地产开发投资总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '全国房地产开发投资同比',
          description: '全国房地产开发投资同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '房地产占GDP比重',
          description: '房地产开发投资占全国GDP的比重',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          年份: '2022',
          全国GDP同比: 0.03,
          全国GDP: 121000000000000,
          全国房地产开发投资: 13000000000000,
          全国房地产开发投资同比: -0.01,
          房地产占GDP比重: 0.0107
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
          fieldName: '年份',
          description: '数据对应的年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '月份范围',
          description: '数据对应的月份范围',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '房地产开发投资',
          description: '全国房地产开发投资总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '住宅投资',
          description: '全国住宅投资总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '住宅投资同比变化',
          description: '住宅投资同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '商品房销售面积',
          description: '全国商品房销售面积',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '商品房销售面积同比变化',
          description: '商品房销售面积同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '住宅销售面积同比变化',
          description: '住宅销售面积同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '商品房销售额',
          description: '全国商品房销售总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '商品房销售额同比变化',
          description: '商品房销售额同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '住宅销售额同比变化',
          description: '住宅销售额同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '房地产开发企业到位资金总额',
          description: '全国房地产开发企业到位资金总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '房地产开发企业到位资金同比变化',
          description: '房地产开发企业到位资金同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '国内贷款',
          description: '全国房地产开发企业国内贷款总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '国内贷款同比变化',
          description: '国内贷款同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '利用外资',
          description: '全国房地产开发企业利用外资总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '利用外资同比变化',
          description: '利用外资同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '自筹资金总额',
          description: '全国房地产开发企业自筹资金总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '自筹资金同比变化',
          description: '自筹资金同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '定金及预收款',
          description: '全国房地产开发企业定金及预收款总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '定金及预收款同比变化',
          description: '定金及预收款同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '个人按揭贷款',
          description: '全国房地产开发企业个人按揭贷款总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '个人按揭贷款同比变化',
          description: '个人按揭贷款同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '国房景气指数',
          description: '房地产开发景气指数',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          年份: '2023',
          月份范围: '1-10月',
          房地产开发投资: 959220000000,
          同比变化: -9.3,
          住宅投资: 727990000000,
          住宅投资同比变化: -8.8,
          商品房销售面积: 925790000,
          商品房销售面积同比变化: -7.8,
          住宅销售面积同比变化: -6.8,
          商品房销售额: 971610000000,
          商品房销售额同比变化: -4.9,
          住宅销售额同比变化: -3.7,
          房地产开发企业到位资金总额: 1073450000000,
          房地产开发企业到位资金同比变化: -13.8,
          国内贷款: 131170000000,
          国内贷款同比变化: -11,
          利用外资: 370000000,
          利用外资同比变化: -40.3,
          自筹资金总额: 347810000000,
          自筹资金同比变化: -21.4,
          定金及预收款: 365960000000,
          定金及预收款同比变化: -10.4,
          个人按揭贷款: 185060000000,
          个人按揭贷款同比变化: -7.6,
          国房景气指数: 93.4
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
          fieldName: '时间范围',
          description: '数据对应的时间范围',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '类型',
          description: '房屋类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '指标',
          description: '房屋相关指标',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '面积',
          description: '房屋面积',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '同比变化百分比',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          时间范围: '1—8月份',
          类型: '房屋',
          指标: '施工面积',
          面积: 7094200000,
          同比变化: -12
        },
        {
          时间范围: '1—8月份',
          类型: '住宅',
          指标: '施工面积',
          面积: 4960520000,
          同比变化: -12.6
        },
        {
          时间范围: '1—8月份',
          类型: '房屋',
          指标: '新开工面积',
          面积: 494650000,
          同比变化: -22.5
        },
        {
          时间范围: '1—8月份',
          类型: '住宅',
          指标: '新开工面积',
          面积: 359090000,
          同比变化: -23
        },
        {
          时间范围: '1—8月份',
          类型: '房屋',
          指标: '竣工面积',
          面积: 333940000,
          同比变化: -23.6
        },
        {
          时间范围: '1—8月份',
          类型: '住宅',
          指标: '竣工面积',
          面积: 243930000,
          同比变化: -23.2
        }
      ]
    },
    {
      isEnglish: false,
      text: `
        从2016年至2020年，由于房价上涨以及一二线城市的成交占比上升，房地产年成交金额从14万亿元升至17万亿元，但年销售面积基本稳定在16亿平方米左右，几乎没有增长`,
      fieldInfo: [
        {
          fieldName: '年份',
          description: '数据对应的年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '年成交金额',
          description: '房地产年成交金额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '年销售面积',
          description: '房地产年销售面积',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          年份: '2016',
          年成交金额: 140000000000000,
          年销售面积: 1600000000
        },
        {
          年份: '2020',
          年成交金额: 170000000000000,
          年销售面积: 1600000000
        }
      ]
    },
    {
      isEnglish: false,
      text: `2004-2019年全年，全国商品房销售均价（元/平方米）约2778，3167，3366，3863，3800，4681，5032，5357，5790，6237，6324，6793，7476，7892，8736，9310。`,
      fieldInfo: [
        {
          fieldName: '年份',
          description: '数据对应的年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '全国商品房销售均价',
          description: '全国商品房销售的平均价格',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          年份: '2004',
          全国商品房销售均价: 2778
        },
        {
          年份: '2005',
          全国商品房销售均价: 3167
        },
        {
          年份: '2006',
          全国商品房销售均价: 3366
        },
        {
          年份: '2007',
          全国商品房销售均价: 3863
        },
        {
          年份: '2008',
          全国商品房销售均价: 3800
        },
        {
          年份: '2009',
          全国商品房销售均价: 4681
        },
        {
          年份: '2010',
          全国商品房销售均价: 5032
        },
        {
          年份: '2011',
          全国商品房销售均价: 5357
        },
        {
          年份: '2012',
          全国商品房销售均价: 5790
        },
        {
          年份: '2013',
          全国商品房销售均价: 6237
        },
        {
          年份: '2014',
          全国商品房销售均价: 6324
        },
        {
          年份: '2015',
          全国商品房销售均价: 6793
        },
        {
          年份: '2016',
          全国商品房销售均价: 7476
        },
        {
          年份: '2017',
          全国商品房销售均价: 7892
        },
        {
          年份: '2018',
          全国商品房销售均价: 8736
        },
        {
          年份: '2019',
          全国商品房销售均价: 9310
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
          fieldName: '年份',
          description: '具体年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '月份',
          description: '具体月份',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '姓名',
          description: '富豪姓名',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '公司',
          description: '公司名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '财富',
          description: '财富值',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '排名',
          description: '排名',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '榜单',
          description: '榜单名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        }
      ],
      dataTable: [
        {
          年份: 2013,
          月份: '10月',
          姓名: '王健林',
          公司: '万达集团',
          财富: 86000000000,
          排名: '首富',
          榜单: '福布斯中国大陆富豪榜'
        },
        {
          年份: 2015,
          月份: '03月',
          姓名: '王健林',
          公司: '万达集团',
          财富: 24200000000,
          排名: '首富',
          榜单: '福布斯'
        },
        {
          年份: 2017,
          月份: '10月',
          姓名: '许家印',
          公司: '恒大地产集团',
          财富: 290000000000,
          排名: '首富',
          榜单: '2017胡润百富榜'
        },
        {
          年份: 2018,
          月份: null,
          姓名: '许家印',
          公司: '恒大地产集团',
          财富: 212500000000,
          排名: 'No.3',
          榜单: '福布斯中国大陆富豪榜'
        },
        {
          年份: 2018,
          月份: null,
          姓名: '王健林',
          公司: '万达集团',
          财富: 156600000000,
          排名: 'No.4',
          榜单: '福布斯中国大陆富豪榜'
        },
        {
          年份: 2018,
          月份: null,
          姓名: '杨惠妍',
          公司: '碧桂园',
          财富: 118000000000,
          排名: 'No.6',
          榜单: '福布斯中国大陆富豪榜'
        },
        {
          年份: 2018,
          月份: null,
          姓名: '杨惠妍',
          公司: '碧桂园',
          财富: 126900000000,
          排名: '最富有女性榜榜首',
          榜单: '中国女富豪榜'
        },
        {
          年份: 2018,
          月份: null,
          姓名: '吴亚军',
          公司: '龙湖集团',
          财富: 60750000000,
          排名: '第二名',
          榜单: '中国女富豪榜'
        },
        {
          年份: 2018,
          月份: null,
          姓名: '陈丽华',
          公司: '富华国际集团',
          财富: 39150000000,
          排名: '第三名',
          榜单: '中国女富豪榜'
        }
      ]
    },
    {
      isEnglish: false,
      text: `1-8月，北京市房屋施工面积10870.3万平方米，同比下降9.9%，其中住宅施工面积5434.9万平方米，下降9.1%。北京市商品房销售面积658.1万平方米，同比下降5.1%，其中住宅销售面积466.6万平方米，下降8.7%。
    `,
      fieldInfo: [
        {
          fieldName: '时间',
          description: '数据对应的时间范围',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '地区',
          description: '数据对应的地区',
          type: 'region',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '房屋类型',
          description: '房屋的类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '指标',
          description: '数据指标',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '面积',
          description: '房屋面积',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '同比变化率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          时间: '1-8月',
          地区: '北京市',
          房屋类型: '房屋',
          指标: '施工面积',
          面积: 108703000,
          同比变化: -9.9
        },
        {
          时间: '1-8月',
          地区: '北京市',
          房屋类型: '住宅',
          指标: '施工面积',
          面积: 54349000,
          同比变化: -9.1
        },
        {
          时间: '1-8月',
          地区: '北京市',
          房屋类型: '商品房',
          指标: '销售面积',
          面积: 6581000,
          同比变化: -5.1
        },
        {
          时间: '1-8月',
          地区: '北京市',
          房屋类型: '住宅',
          指标: '销售面积',
          面积: 4666000,
          同比变化: -8.7
        }
      ]
    },
    {
      isEnglish: false,
      text: `近年来建筑工程系在人才培养、教学改革、科学研究、学科建设、国际交流、社会服务、系企合作等各个层面取得了国内外公认的丰硕成果。每年平均招收各类硕士研究生220多名、博士研究生50多名`,
      fieldInfo: [
        {
          fieldName: '类别',
          description: '研究生类别',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '平均招收人数',
          description: '每年平均招收人数',
          type: 'count',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          类别: '硕士研究生',
          平均招收人数: 220
        },
        {
          类别: '博士研究生',
          平均招收人数: 50
        }
      ]
    },
    {
      isEnglish: false,
      text: `此次调查显示，如果将东京港区元麻布的分户出售住宅的每坪(3.3平方米)单价定为100(按日元计算)，大阪为68.2，与全球15个主要城市中最高的香港(268.2)相比，均不到一半。在其他主要城市中，从高到低依次为伦敦的207.5，台北和上海165.6，纽约144.6，新加坡140.2。`,
      fieldInfo: [
        {
          fieldName: '城市',
          description: '城市名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '每坪单价',
          description: '每坪(3.3平方米)的单价，单位为日元',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          城市: '东京港区元麻布',
          每坪单价: 100
        },
        {
          城市: '大阪',
          每坪单价: 68.2
        },
        {
          城市: '香港',
          每坪单价: 268.2
        },
        {
          城市: '伦敦',
          每坪单价: 207.5
        },
        {
          城市: '台北',
          每坪单价: 165.6
        },
        {
          城市: '上海',
          每坪单价: 165.6
        },
        {
          城市: '纽约',
          每坪单价: 144.6
        },
        {
          城市: '新加坡',
          每坪单价: 140.2
        }
      ]
    },
    {
      isEnglish: false,
      text: `
  Alabama:
  典型独立住宅房价:$220,659(相当于美国典型房价的63%)
  家庭收入中位数占房屋价值的百分比:27%
  Alabama可负担性相对较好.家庭收入中位数相当于全国水平的80%，但房价在全国排名倒数第9。
  
  Alaska:
  典型独立住宅房价:$369,997(相当于美国典型房价的106%)
  家庭收入中位数占房屋价值的百分比:24%
  阿拉斯加的房价比全国平均房价高6%，但收入中位数比全国中位数高18%，两者相互抵消了。
  
  Arizona:
  典型独立住宅房价:$430,577(相当于美国典型房价的123%)
  家庭收入中位数占房屋价值的百分比:17%
  亚利桑那州住宅价格昂贵，比美国平均价格高出23%。该州家庭收入中位数与全国平均水平一致，在亚利桑那州买房不是最实惠的选择。
  
  Arkansas:
  典型独立住宅房价:$198,511(相当于美国典型房价的57%)
  家庭收入中位数占房屋价值的百分比:28%
  
  阿肯色州的房屋价格是美国倒数第三低的。尽管阿肯色州的家庭收入中位数比全国平均水平低26%，但该州的收入与房屋价值比却是最高(最好)的。
  
  California:
  典型独立住宅房价:$760,526(相当于美国典型房价的217%)
  家庭收入中位数占房屋价值的百分比:12%
  加州的房屋价格是美国第二高的，而收入与房屋价值之比是美国第二低的，尽管居民收入比美国中位数高出22%。
  
  Colorado:
  典型独立住宅房价:$548,012(相当于美国典型房价的157%)
  家庭收入中位数占房屋价值的百分比:16%
  科罗拉多州的房价在全国排名第六，而该州的收入与房屋价值比在全国排名倒数第六，尽管那里的家庭中位数比全国平均水平高出19%。
  
  Connecticut:
  典型独立住宅房价:$405,050(相当于美国典型房价的116%)
  家庭收入中位数占房屋价值的百分比:22%
  康涅狄格州的房价比美国典型房价高16%，但该州拥有相对较高的收入与房屋价值比，房价在一定程度上还是可以承受的。
  
  Delaware:
  典型独立住宅房价:$370,761(相当于美国典型房价的106%)
  家庭收入中位数占房屋价值的百分比:22%
  特拉华州的房价比美国典型房价高6%，但该州家庭收入中位数比美国高10%，两者相互抵消了。
  
  DistrictofColumbia:
  典型独立住宅房价:$722,619(相当于美国典型房价的206%)
  家庭收入中位数占房屋价值的百分比:14%
  华盛顿特区的房价是全国第三高的，收入与房屋价值之比是全国第三低的，尽管那里的收入中位数比全国中位数高35%。
  
  Florida:
  典型独立住宅房价:$407,218(相当于美国典型房价的116%)
  家庭收入中位数占房屋价值的百分比:17%
  佛罗里达州房屋价格比美国典型房价高16%，但该州家庭收入中位数比美国家庭收入中位数低7%，导致收入与房屋价值比较低，房价的可负担性令人担忧。
  
  Georgia:
  典型独立住宅房价:$320,091(相当于美国典型房价的91%)
  家庭收入中位数占房屋价值的百分比:23%
  乔治亚州的房价并不贵，但由于该州的收入低于中位数，房价的可负担性一般。
  
  Hawaii:
  典型独立住宅房价:$971,167(相当于美国典型房价的277%)
  家庭收入中位数占房屋价值的百分比:10%
  夏威夷的房价是全国最贵的，也是最难以负担的，尽管夏威夷的收入中位数比全国中位数高24%，但家庭收入与房屋价值之比很低。
  
  Idaho:
  典型独立住宅房价:$444,451(相当于美国典型房价的127%)
  家庭收入中位数占房屋价值的百分比:16%
  爱达荷州的房子比美国平均房价贵27%。这就带来了负担能力问题，因为爱达荷州的家庭收入中位数比全国平均水平低3%。
  
  Illinois:
  典型独立住宅房价:$255,659(相当于美国典型房价的73%)
  家庭收入中位数占房屋价值的百分比:30%
  伊利诺斯州的房价远低于美国的典型房价，可负担性非常好，因为那里的家庭收入中位数还略高于美国的中位数。
  
  Indiana:
  典型独立住宅房价:$233,554(相当于美国典型房价的67%)
  家庭收入中位数占房屋价值的百分比:29%
  印第安纳州的房价比美国典型价格低33%，而家庭收入中位数仅比美国中位数低11%，因此印第安纳州的房价是可以承受的。
  
  Iowa:
  典型独立住宅房价:$216,265(相当于美国典型房价的62%)
  家庭收入中位数占房屋价值的百分比:32%
  爱荷华州的家庭收入与房屋价值之比排名第二，可负担性好。因为房价很低，仅为美国典型房屋价格的62%，而家庭收入中位数仅比全国中位数低7%。
  
  Kansas:
  典型独立住宅房价:$219,578(相当于美国典型房价的62%)
  家庭收入中位数占房屋价值的百分比:31%
  堪萨斯州的房价是美国典型房价的63%，是全美房价可负担性最好的地区之一，收入与房屋价值之比很高。
  
  Kentucky:
  典型独立住宅房价:$197,627(相当于美国典型房价的56%)
  家庭收入中位数占房屋价值的百分比:30%
  肯塔基州的住宅价格比美国的典型住宅便宜42%。尽管肯塔基州的家庭收入中位数比美国家庭收入中位数低21%，但该州的收入与房屋价值比很高。
  
  Louisiana:
  典型独立住宅房价:$201,639(相当于美国典型房价的58%)
  家庭收入中位数占房屋价值的百分比:28%
  路易斯安那州的典型房屋价值为201,639美元，仅为美国典型房屋价值的58%。这使得收入与房屋价值之比很高，尽管路易斯安那州的家庭收入中位数比全国平均水平低26%。
  
  Maine:
  典型独立住宅房价:$385,874(相当于美国典型房价的110%)
  家庭收入中位数占房屋价值的百分比:18%
  缅因州的住宅价格高于美国典型住宅价格的10%。但家庭收入中位数比全国平均水平低7%，因此该州的收入与房屋价值之比低于平均水平。
  
  Maryland:
  典型独立住宅房价:$418,269(相当于美国典型房价的119%)
  家庭收入中位数占房屋价值的百分比:23%
  马里兰州的住宅价格为418,269美元，比美国典型房价高出19%。但这在一定程度上被马里兰州家庭收入中位数比全国中位数高27%所抵消。
  
  Massachusetts:
  典型独立住宅房价:$607,770(相当于美国典型房价的119%)
  家庭收入中位数占房屋价值的百分比:15%
  马萨诸塞州的房屋价格排名全美第四，但收入与房屋价值之比却处于最低之列，尽管该州的收入中位数比全国中位数高出26%。
  
  Michigan:
  典型独立住宅房价:$$235,236(相当于美国典型房价的67%)
  家庭收入中位数占房屋价值的百分比:28%
  由于房屋价格较低，收入中位数接近全国中位数，密歇根州的房价处于可承担的范围内。
  
  Minnesota:
  典型独立住宅房价:$$336,351(相当于美国典型房价的96%)
  家庭收入中位数占房屋价值的百分比:24%
  明尼苏达州的房价为336,351美元，仅比全国典型房价低4%。这里的家庭收入中位数比全国中位数高10%，房价相对便宜。
  
  Mississippi:
  典型独立住宅房价:$176,725(相当于美国典型房价的50%)
  家庭收入中位数占房屋价值的百分比:30%
  密西西比州的房价为176,725美元，是美国典型房价的50%，是全国第二低房价。虽然收入中位数是美国中位数的71%，但收入与房屋价值之比在全国排名第七。
  
  Missouri:
  典型独立住宅房价:$240,129(相当于美国典型房价的69%)
  家庭收入中位数占房屋价值的百分比:27%
  密苏里州的典型房屋价格是美国平均房价的69%，因此收入与房屋价值比高于平均水平，尽管那里的家庭收入中位数比全国平均水平低13%。
  
  Montana:
  典型独立住宅房价:$454,673(相当于美国典型房价的130%)
  家庭收入中位数占房屋价值的百分比:15%
  蒙大拿州是收入与房屋价值比最低的州之一，因为那里的房屋比美国平均房屋价格贵30%，而收入中位数比美国平均收入低10%。
  
  Nebraska:
  典型独立住宅房价:$254,636(相当于美国典型房价的73%)
  家庭收入中位数占房屋价值的百分比:27%
  内布拉斯加州的典型房屋价格为254,636美元，是美国典型房屋价值的73%。因此，该州的收入与房屋价值比很高。
  
  Nevada:
  典型独立住宅房价:$432,527(相当于美国典型房价的124%)
  家庭收入中位数占房屋价值的百分比:17%
  内华达州独立住宅的平均价格为432,527美元，比美国典型房价高出24%。家庭收入中位数略低于全国中位数，住房负担能力令人担忧。
  
  NewHampshire:
  典型独立住宅房价:$470,958(相当于美国典型房价的135%)
  家庭收入中位数占房屋价值的百分比:19%
  房价很高，收入与房屋价值之比低于平均水平。
  
  NewJersey:
  典型独立住宅房价:$507,923(相当于美国典型房价的145%)
  家庭收入中位数占房屋价值的百分比:19%
  作为人口最密集的州，新泽西州典型的独户住宅价格为507,923美元。家庭收入中位数高于美国的中位数，但收入与房屋价值之比使其可负担性不高。
  
  NewMexico:
  典型独立住宅房价:$293,540(相当于美国典型房价的84%)
  家庭收入中位数占房屋价值的百分比:20%
  虽然新墨西哥州的典型房屋价格低于美国的典型房价，但该州的家庭收入中位数也远低于全国的中位数，导致收入与房屋价值比较低，房价可负担性令人担忧。
  
  NewYork:
  典型独立住宅房价:$425,011(相当于美国典型房价的121%)
  家庭收入中位数占房屋价值的百分比:19%
  纽约的典型房价为425,011美元，是美国典型房价的121%。纽约的家庭收入中位数仅比全国中位数高6%，收入与房屋价值之比很低。
  
  NorthCarolina:
  典型独立住宅房价:$321,908(相当于美国典型房价的92%)
  家庭收入中位数占房屋价值的百分比:21%
  北卡罗莱纳州的房价略低于全国的典型房价，家庭收入中位数也略低。因此，收入与房屋价值之比表现一般。
  
  NorthDakota:
  典型独立住宅房价:$261,931(相当于美国典型房价的75%)
  家庭收入中位数占房屋价值的百分比:27%
  达科他州收入与房屋价值比较好，因为房价远低于全国典型房价，家庭收入中位数接近全国中位数。
  
  Ohio:
  典型独立住宅房价:$220,031(相当于美国典型房价的63%)
  家庭收入中位数占房屋价值的百分比:30%
  俄亥俄州的典型房屋价格在全国排名倒数第九。家庭收入中位数是美国中位数的88%，从而导致收入与房屋价值比较号，排名正数第九。
  
  Oklahoma:
  典型独立住宅房价:$199,559(相当于美国典型房价的57%)
  家庭收入中位数占房屋价值的百分比:30%
  俄克拉何马州房屋价格便宜，只有美国典型房价的57%。收入中位数很低，只有全国中位数的80%，但这足以使俄克拉何马州成为最负担得起的住房市场之一。
  
  Oregon:
  典型独立住宅房价:$501,513(相当于美国典型房价的143%)
  家庭收入中位数占房屋价值的百分比:15%
  俄勒冈州的收入与房屋价值比是全美第五低的，因为该州房屋价格在全国排名第九，而家庭收入中位数仅比全国中位数高1%。
  
  Pennsylvania:
  典型独立住宅房价:$257,912(相当于美国典型房价的74%)
  家庭收入中位数占房屋价值的百分比:28%
  宾夕法尼亚州可负担性好，房价是全国典型价格的74%，家庭收入中位数几乎与全国中位数持平。
  
  RhodeIsland:
  典型独立住宅房价:$444,7162(相当于美国典型房价的127%)
  家庭收入中位数占房屋价值的百分比:18%
  罗德岛房价444,716美元，家庭收入中位数仅比全国中位数高9%，可负担性充满挑战。
  
  SouthCarolina:
  典型独立住宅房价:$287,956(相当于美国典型房价的82%)
  家庭收入中位数占房屋价值的百分比:22%
  南卡罗来纳州的房价和家庭收入中位数都略低于全国典型的房价和家庭收入中位数，导致收入与房屋价值比也处于平均水平。
  
  SouthDakota:
  典型独立住宅房价:$297,804(相当于美国典型房价的85%)
  家庭收入中位数占房屋价值的百分比:23%
  南达科他州的房屋价格比美国典型房屋价值低15%，而该州的收入中位数仅比全国中位数低7%。因此，房价相对来说是可以承受的。
  
  Tennessee:
  典型独立住宅房价:$310,132(相当于美国典型房价的89%)
  家庭收入中位数占房屋价值的百分比:21%
  田纳西州住宅价格为310,132美元，是美国典型住宅价格的89%。中等家庭收入是全国平均水平的87%，收入与房屋价值之比略低于平均水平。
  
  Texas:
  典型独立住宅房价:$303,414(相当于美国典型房价的87%)
  家庭收入中位数占房屋价值的百分比:24%
  德克萨斯州的房价比全国典型房价低13%。收入中位数是全国收入中位数的96%，其收入/房屋价值略高于平均水平。
  
  Utah:
  典型独立住宅房价:$518,938(相当于美国典型房价的148%)
  家庭收入中位数占房屋价值的百分比:17%
  犹他州的房屋价格在全国排名第七，是美国典型房屋价值的150%。该州的家庭收入中位数仅比全国中位数高19%，因此住房相对难以负担。
  
  Vermont:
  典型独立住宅房价:$397,388(相当于美国典型房价的114%)
  家庭收入中位数占房屋价值的百分比:19%
  佛蒙特州的房价比美国典型房价高出10%，家庭收入中位数略高于全国中位数，收入与房屋价值比处于平均水平。
  
  Virginia:
  典型独立住宅房价:$377,498(相当于美国典型房价的108%)
  家庭收入中位数占房屋价值的百分比:23%
  房屋价格和家庭收入中位数都高出8%，因此收入与房屋价值之比是平均水平。
  
  Washington:
  典型独立住宅房价:$585,767(相当于美国典型房价的167%)
  家庭收入中位数占房屋价值的百分比:16%
  华盛顿州的房价是全美第五高的，尽管该州的收入中位数高于全国中位数，但其收入与房屋价值之比却位于全美最低之列。
  
  WestVirginia:
  典型独立住宅房价:$158,172(相当于美国典型房价的45%)
  家庭收入中位数占房屋价值的百分比:34%
  西弗吉尼亚州是美国房价最低的州，仅为美国典型房价的45%。因此西弗吉尼亚州的收入与房价之比是全国最高的。
  
  Wisconsin:
  典型独立住宅房价:$296,580(相当于美国典型房价的85%)
  家庭收入中位数占房屋价值的百分比:24%
  威斯康星州的典型房屋价格为296,580美元，收入中位数接近全国中位数，该州的收入与房屋价值比高于平均水平。
  
  Wyoming:
  典型独立住宅房价:$339,601(相当于美国典型房价的97%)
  家庭收入中位数占房屋价值的百分比:21%
  怀俄明州的典型房屋价格几乎与全国典型房价持平，收入中位数略低于全国中位数，导致收入与房屋价值之比略低于平均水平。`,
      fieldInfo: [
        {
          fieldName: '地区',
          type: 'string',
          description: '洲名称',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '住宅房价',
          type: 'numerical',
          description: '典型独立住宅房价',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          地区: 'Alabama',
          住宅房价: 220657
        },
        {
          地区: 'Alaska',
          住宅房价: 369997
        },
        {
          地区: 'Arizona',
          住宅房价: 430577
        },
        {
          地区: 'Arkansas',
          住宅房价: 198511
        },
        {
          地区: 'California',
          住宅房价: 760526
        },
        {
          地区: 'Colorado',
          住宅房价: 548012
        },
        {
          地区: 'Connecticut',
          住宅房价: 405050
        },
        {
          地区: 'Delaware',
          住宅房价: 370761
        },
        {
          地区: 'DistrictofColumbia',
          住宅房价: 722619
        },
        {
          地区: 'Florida',
          住宅房价: 407218
        },
        {
          地区: 'Georgia',
          住宅房价: 320091
        },
        {
          地区: 'Hawaii',
          住宅房价: 971167
        },
        {
          地区: 'Idaho',
          住宅房价: 444451
        },
        {
          地区: 'Illinois',
          住宅房价: 255659
        },
        {
          地区: 'Indiana',
          住宅房价: 233554
        },
        {
          地区: 'Iowa',
          住宅房价: 216265
        },
        {
          地区: 'Kansas',
          住宅房价: 219578
        },
        {
          地区: 'Kentucky',
          住宅房价: 197627
        },
        {
          地区: 'Louisiana',
          住宅房价: 201639
        },
        {
          地区: 'Maine',
          住宅房价: 385874
        },
        {
          地区: 'Maryland',
          住宅房价: 418269
        },
        {
          地区: 'Massachusetts',
          住宅房价: 607770
        },
        {
          地区: 'Michigan',
          住宅房价: 235236
        },
        {
          地区: 'Minnesota',
          住宅房价: 336351
        },
        {
          地区: 'Mississippi',
          住宅房价: 176725
        },
        {
          地区: 'Missouri',
          住宅房价: 240129
        },
        {
          地区: 'Montana',
          住宅房价: 454673
        },
        {
          地区: 'Nebraska',
          住宅房价: 254636
        },
        {
          地区: 'Nevada',
          住宅房价: 432527
        },
        {
          地区: 'NewHampshire',
          住宅房价: 470958
        },
        {
          地区: 'NewJersey',
          住宅房价: 507923
        },
        {
          地区: 'NewMexico',
          住宅房价: 293540
        },
        {
          地区: 'NewYork',
          住宅房价: 425011
        },
        {
          地区: 'NorthCarolina',
          住宅房价: 321908
        },
        {
          地区: 'NorthDakota',
          住宅房价: 261931
        },
        {
          地区: 'Ohio',
          住宅房价: 220031
        },
        {
          地区: 'Oklahoma',
          住宅房价: 199559
        },
        {
          地区: 'Oregon',
          住宅房价: 501513
        },
        {
          地区: 'Pennsylvania',
          住宅房价: 257912
        },
        {
          地区: 'RhodeIsland',
          住宅房价: 444716
        },
        {
          地区: 'SouthCarolina',
          住宅房价: 287956
        },
        {
          地区: 'SouthDakota',
          住宅房价: 297804
        },
        {
          地区: 'Tennessee',
          住宅房价: 310132
        },
        {
          地区: 'Texas',
          住宅房价: 303414
        },
        {
          地区: 'Utah',
          住宅房价: 518938
        },
        {
          地区: 'Vermont',
          住宅房价: 397388
        },
        {
          地区: 'Virginia',
          住宅房价: 377498
        },
        {
          地区: 'Washington',
          住宅房价: 585767
        },
        {
          地区: 'WestVirginia',
          住宅房价: 158172
        },
        {
          地区: 'Wisconsin',
          住宅房价: 296580
        },
        {
          地区: 'Wyoming',
          住宅房价: 339601
        }
      ]
    }
  ]
};

const environmentData = {
  domain: 'environment',
  data: [
    {
      isEnglish: false,
      text: `2014年，全国近岸海域总体水质基本保持稳定，水质级别为一般, 主要超标因子是无机氮和活性磷酸盐。按照监测点位计算：一类海水比例为28.6%，与上年相比，上升4.0个百分点；二类海水比例为38.2%，下降3.6个百分点；三类海水比例为7.0%，下降1.0个百分点；四类海水比例为7.6%，上升0.6个百分点；劣四类海水比例为18.6%，比例持平。`,
      fieldInfo: [
        {
          fieldName: '类别',
          type: 'string',
          description: 'type'
        },
        {
          fieldName: '比例',
          type: 'ratio',
          description: 'percent'
        },
        {
          fieldName: '同比变化',
          type: 'numerical',
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
          type: 'region',
          description: 'Sea Area'
        },
        {
          fieldName: '超标率',
          type: 'numerical',
          description: 'Exceeding standard rate'
        },
        {
          fieldName: '浓度',
          type: 'numerical',
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
          type: 'region',
          description: 'area'
        },
        {
          fieldName: '沉淀物质量',
          type: 'string',
          description: '沉淀物'
        },
        {
          fieldName: '量好点位比例',
          type: 'ratio',
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
          type: 'string',
          description: 'Pollutants'
        },
        {
          fieldName: '监测站',
          type: 'string',
          description: 'place'
        },
        {
          fieldName: '含量',
          type: 'numerical',
          description: 'content'
        },
        {
          fieldName: '极值类型',
          type: 'string',
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
          type: 'string',
          description: 'Pollutants'
        },
        {
          fieldName: '监测站',
          type: 'string',
          description: 'place'
        },
        {
          fieldName: '沉降通量',
          type: 'numerical',
          description: 'flux'
        },
        {
          fieldName: '极值类型',
          type: 'string',
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
          type: 'string',
          description: 'type'
        },
        {
          fieldName: '次数',
          type: 'numerical',
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
          type: 'string',
          description: 'name'
        },
        {
          fieldName: '保护地级别',
          type: 'string',
          description: 'level'
        },
        {
          fieldName: '新增或调整',
          type: 'string',
          description: 'add or adjust'
        },
        {
          fieldName: '面积',
          type: 'numerical',
          description: 'area'
        },
        {
          fieldName: '面积变化',
          type: 'numerical',
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
          type: 'string',
          description: 'Ion Type'
        },
        {
          fieldName: '离子名称',
          type: 'string',
          description: 'Ion Name'
        },
        {
          fieldName: '浓度比例',
          type: 'numerical',
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
          type: 'string',
          description: 'type'
        },
        {
          fieldName: '占比',
          type: 'ratio',
          description: 'percent'
        },
        {
          fieldName: '同比变化',
          type: 'numerical',
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
          type: 'string',
          description: 'noise level'
        },
        {
          fieldName: '城市个数',
          type: 'numerical',
          description: 'number of cities'
        },
        {
          fieldName: '占比',
          type: 'numerical',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '各年龄段运动员占比',
          type: 'ratio',
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
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '体育产业总规模',
          description: '体育产业的总规模',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '体育产业增加值',
          description: '体育产业的增加值',
          type: 'numerical',
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
          type: 'region',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '运动员人数',
          description: '参加奥运会的运动员人数',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '大项数量',
          description: '参加的大项数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '小项数量',
          description: '参加的小项数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '金牌数',
          description: '获得的金牌数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '银牌数',
          description: '获得的银牌数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '铜牌数',
          description: '获得的铜牌数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '最佳成绩',
          description: '是否创造了历届奥运会参赛最佳成绩',
          type: 'string',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '球队',
          description: '球员所属球队',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '数据类型',
          description: '球员数据类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '场均数据',
          description: '球员场均数据',
          type: 'numerical',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '年龄',
          description: '球星在第21个赛季的年龄',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '出场次数',
          description: '球星在第21个赛季的出场次数',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '场均得分',
          description: '球星在第21个赛季的场均得分',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '场均篮板',
          description: '球星在第21个赛季的场均篮板',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '场均助攻',
          description: '球星在第21个赛季的场均助攻',
          type: 'numerical',
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
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '行业类别',
          description: '具体行业类别',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '行业营业收入',
          description: '具体行业的营业收入',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '行业同比增长',
          description: '具体行业的营业收入同比增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '两年平均增长',
          description: '具体行业的营业收入两年平均增长率',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '地区',
          description: '省份或城市名称',
          type: 'region',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '排名',
          description: '票房排名',
          type: 'numerical',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '演出场次',
          description: '演出场次数量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '与2019年相比增长',
          description: '与2019年相比的增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '票房收入',
          description: '票房收入金额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比增长',
          description: '与去年同期相比的增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '观演人数',
          description: '观演人数数量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '观演人数同比增长',
          description: '观演人数与去年同期相比的增长率',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '语言',
          description: '学术论文使用的语言',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '学术论文使用该语言的比例',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '世界遗产总数',
          description: '世界遗产的总数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '世界文化遗产',
          description: '世界文化遗产的数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '世界自然遗产',
          description: '世界自然遗产的数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '世界文化与自然双重遗产',
          description: '世界文化与自然双重遗产的数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '占比',
          description: '世界遗产占比',
          type: 'ratio',
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
          数值: 1585070000000
        },
        {
          指标: '农林牧渔业总产值',
          年份: '1952',
          数值: 46100000000
        },
        {
          指标: '年均增长',
          年份: '1953-2023',
          数值: 4.5
        },
        {
          指标: '年均增长',
          年份: '1979-2023',
          数值: 5.5
        },
        {
          指标: '年均增长',
          年份: '1953-1978',
          数值: 2.8
        },
        {
          指标: '农业年均增速',
          年份: '1953-2023',
          数值: 3.8
        },
        {
          指标: '林业年均增速',
          年份: '1953-2023',
          数值: 6.7
        },
        {
          指标: '牧业年均增速',
          年份: '1953-2023',
          数值: 5.6
        },
        {
          指标: '渔业年均增速',
          年份: '1953-2023',
          数值: 8.7
        },
        {
          指标: '农林牧渔专业及辅助性活动年均增速',
          年份: '2004-2023',
          数值: 7.5
        }
      ],
      fieldInfo: [
        {
          fieldName: '指标',
          description: '具体指标名称',
          type: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份或范围',
          type: 'string'
        },
        {
          fieldName: '数值',
          description: '具体数值',
          type: 'numerical'
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
          比重: 85.9
        },
        {
          指标: '林业产值占总产值比重',
          年份: '1952',
          比重: 1.6
        },
        {
          指标: '牧业产值占总产值比重',
          年份: '1952',
          比重: 11.2
        },
        {
          指标: '渔业产值占总产值比重',
          年份: '1952',
          比重: 1.3
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
          比重: 4.4
        },
        {
          指标: '牧业产值占总产值比重',
          年份: '2023',
          比重: 24.6
        },
        {
          指标: '渔业产值占总产值比重',
          年份: '2023',
          比重: 10.2
        },
        {
          指标: '比重变化（农业）',
          年份: '1952-2023',
          比重: -31.0
        },
        {
          指标: '比重变化（林业）',
          年份: '1952-2023',
          比重: 2.8
        },
        {
          指标: '比重变化（牧业）',
          年份: '1952-2023',
          比重: 13.4
        },
        {
          指标: '比重变化（渔业）',
          年份: '1952-2023',
          比重: 8.9
        },
        {
          指标: '农林牧渔专业及辅助性活动占总产值比重',
          年份: '2023',
          比重: 5.9
        }
      ],
      fieldInfo: [
        {
          fieldName: '指标',
          description: '具体指标名称',
          type: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份或者年份范围',
          type: 'string'
        },
        {
          fieldName: '比重',
          description: '各产业占总产值的比重/比重变化',
          type: 'ratio'
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
          产值: 11358000000000
        },
        {
          产业类型: '种植业',
          年份: '2018',
          产值: 6145000000000
        },
        {
          产业类型: '畜牧业',
          年份: '2018',
          产值: 2870000000000
        },
        {
          产业类型: '渔业',
          年份: '2018',
          产值: 1213000000000
        },
        {
          产业类型: '林业',
          年份: '2018',
          产值: 543300000000
        }
      ],
      fieldInfo: [
        {
          fieldName: '产业类型',
          description: '农业产业的具体类型',
          type: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份',
          type: 'date'
        },
        {
          fieldName: '产值',
          description: '产业产值',
          type: 'numerical'
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
          产量: 138780000
        },
        {
          农产品类型: '秋粮',
          年份: '2018',
          产量: 490520000
        },
        {
          农产品类型: '早稻',
          年份: '2018',
          产量: 28590000
        },
        {
          农产品类型: '棉花',
          年份: '2018',
          产量: 6100000
        },
        {
          农产品类型: '粮食',
          年份: '2018',
          产量: 657890000
        },
        {
          农产品类型: '豆类',
          年份: '2018',
          产量: 19200000
        },
        {
          农产品类型: '薯类',
          年份: '2018',
          产量: 28650000
        },
        {
          农产品类型: '肉类',
          年份: '2018',
          产量: 86250000
        },
        {
          农产品类型: '水产品',
          年份: '2018',
          产量: 64580000
        }
      ],
      fieldInfo: [
        {
          fieldName: '农产品类型',
          description: '农产品的具体种类',
          type: 'string'
        },
        {
          fieldName: '年份',
          description: '具体年份',
          type: 'date'
        },
        {
          fieldName: '产量',
          description: '农产品产量',
          type: 'numerical'
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
          type: 'string'
        },
        {
          fieldName: '工程量',
          description: '项目工程量',
          type: 'number or string depending on content'
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
          type: 'string'
        },
        {
          fieldName: '价格变化幅度',
          description: '价格同比变化幅度',
          type: 'ratio'
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
          type: 'string'
        },
        {
          fieldName: '数值',
          description: '具体指标数值',
          type: 'number or percentage depending on content'
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
          type: 'string'
        },
        {
          fieldName: '2018 年数值',
          description: '2018 年对应指标数值',
          type: 'percentage'
        },
        {
          fieldName: '2025 年数值',
          description: '2025 年对应指标数值',
          type: 'percentage'
        },
        {
          fieldName: '年均增速',
          description: '对应指标的年均增长速度',
          type: 'percentage'
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
          '2023 年人数': 72000
        },
        {
          培育对象: '家庭农场主',
          '2023 年人数': 129000
        },
        {
          培育对象: '农业社会化服务组织带头人',
          '2023 年人数': 43000
        },
        {
          培育对象: '农业企业负责人',
          '2023 年人数': 42000
        },
        {
          培育对象: '农业职业经理人',
          '2023 年人数': 8000
        },
        {
          培育对象: '农村电商带头人',
          '2023 年人数': 19000
        },
        {
          培育对象: '脱贫区域产业带头人',
          '2023 年人数': 66000
        },
        {
          培育对象: '返乡群体（大学毕业生、农民工和退役军人等）',
          '2023 年人数': 105000
        },
        {
          培育对象: '学习‘三品一标’相关课程人员',
          '2023 年人数': 117000
        },
        {
          培育对象: '学习冷链物流相关课程人员',
          '2023 年人数': 28000
        }
      ],
      fieldInfo: [
        {
          fieldName: '培育对象',
          description: '不同的培训对象类别',
          type: 'string'
        },
        {
          fieldName: '2023 年人数',
          description: '2023 年对应培育对象的人数',
          type: 'numerical'
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
          type: 'date'
        },
        {
          fieldName: '支出规模',
          description: '中国零售行业大数据市场支出规模，单位为亿元人名币',
          type: 'numerical'
        }
      ],
      text: '智通财经APP获悉，IDC于近日发布了《零售行业数据智能市场分析——以客户为主导的零售业的逆向体验》。报告显示，2023年，中国零售行业大数据市场支出规模达到4306亿元人民币，预计2027年将增长至9809亿元人民币，年均增长率CAGR为22.9%'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          品类: '酒水',
          整体搜索量环比: 48,
          年份: '2024年年初至1月12日'
        }
      ],
      fieldInfo: [
        {
          fieldName: '年份',
          description: '数据对应的年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '品类',
          description: '商品品类',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '整体搜索量环比',
          description: '整体搜索量环比变化率',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '产品类型',
          description: '零售业信息化产品类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '硬件占比',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '零售额增长率',
          description: '零售额比上年增长率',
          type: 'ratio',
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
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '企业数量',
          description: '企业的数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '销售规模的同比变化',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销量最高车型',
          description: '车型名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销量最高车型销量份额',
          description: '销量份额',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '销量前三车型销量份额',
          description: '销量份额',
          type: 'ratio',
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
          type: 'date',
          dateGranularity: 'month',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '发展指数',
          description: '中国零售药店发展指数',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '环比变化',
          description: '发展指数环比变化',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比变化',
          description: '发展指数同比变化',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '企业数量',
          description: '各类型企业数量',
          type: 'count',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '占比',
          description: '商业模式占比',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '零售额同比增速',
          description: '商品零售额与去年同期相比的增长速度',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '增开旅客列车',
          description: '增开的旅客列车数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '方向',
          description: '热门方向',
          type: 'string',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '同比',
          description: '交易额Year-on-year-Growth率',
          type: 'ratio',
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
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: 'GDP',
          description: '国内生产总值增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '受旅游业的刺激，曾在欧债危机中困难重重的希腊、西班牙、葡萄牙和意大利经济，正凭借强劲的增长一跃成为欧元区的“优等生”。根据欧盟委员会的预测，2024年，这四国的国内生产总值（GDP）增长率分别为2.2%、2.1%、1.7%和0.9%，均高于欧元区0.8%的增长幅度。相比之下，德国仅有0.1%'
    }
  ]
};

const newTravelData = {
  domain: 'travel',
  data: [
    {
      text: `高端度假型民宿同比去年暑假
出租率下降1.0% 平均房价上涨5.5% 单房收入上涨4.9%
舒适旅行型民宿同比去年暑假
出租率基本持平 平均房价下降3.1% 单房收入下降4.0%
实惠出游型民宿同比去年暑假
出租率上涨1.0% 平均房价下降5.3% 单房收入下降2.0%
高端度假型民宿同比去年暑假，平均房价上涨5.5%，单房收入上涨4.9%，显示出高端市场需求仍然强劲，消费者愿意为高端服务支付溢价。这种稳定性为未来的高端度假民宿市场扩展和投资提供了积极的信号。`,
      isEnglish: false,
      fieldInfo: [
        {
          fieldName: '民宿类型',
          description: '民宿的类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '指标',
          description: '具体的指标',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '同比变化',
          description: '与去年暑假相比的变化',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          民宿类型: '高端度假型民宿',
          指标: '出租率',
          同比变化: -1
        },
        {
          民宿类型: '高端度假型民宿',
          指标: '平均房价',
          同比变化: 5.5
        },
        {
          民宿类型: '高端度假型民宿',
          指标: '单房收入',
          同比变化: 4.9
        },
        {
          民宿类型: '舒适旅行型民宿',
          指标: '出租率',
          同比变化: 0
        },
        {
          民宿类型: '舒适旅行型民宿',
          指标: '平均房价',
          同比变化: -3.1
        },
        {
          民宿类型: '舒适旅行型民宿',
          指标: '单房收入',
          同比变化: -4
        },
        {
          民宿类型: '实惠出游型民宿',
          指标: '出租率',
          同比变化: 1
        },
        {
          民宿类型: '实惠出游型民宿',
          指标: '平均房价',
          同比变化: -5.3
        },
        {
          民宿类型: '实惠出游型民宿',
          指标: '单房收入',
          同比变化: -2
        }
      ]
    },
    {
      text: '从出游用户年龄来看，36-45岁以及26-35岁年龄段的用户出游人次占比分别达到了45%和26%。',
      isEnglish: false,
      fieldInfo: [
        {
          fieldName: '年龄段',
          description: '用户年龄段',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '出游人次占比',
          description: '出游人次占比',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          年龄段: '36-45岁',
          出游人次占比: 45
        },
        {
          年龄段: '26-35岁',
          出游人次占比: 26
        },
        {
          年龄段: '其他',
          出游人次占比: 29
        }
      ]
    },
    {
      text: '报告显示，2024年五一假期，酒店行业平均入住率55%，平均房价为293.9元，平均单房收益161.6元，较去年同比增长2.0%。民宿行业平均入住率64.1%，平均房价为414.1元，平均单房收益265.4元，较去年同比下降19.1%。',
      isEnglish: false,
      fieldInfo: [
        {
          fieldName: '年份',
          description: '数据对应的年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '假期',
          description: '假期名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '行业',
          description: '行业类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '平均入住率',
          description: '行业的平均入住率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '平均房价',
          description: '行业的平均房价',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '平均单房收益',
          description: '行业的平均单房收益',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比增长率',
          description: '与去年相比的增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          行业: '酒店',
          平均入住率: 55,
          平均房价: 293.9,
          平均单房收益: 161.6,
          同比增长率: 2
        },
        {
          行业: '民宿',
          平均入住率: 64.1,
          平均房价: 414.1,
          平均单房收益: 265.4,
          同比增长率: -19.1
        }
      ]
    },
    {
      isEnglish: false,
      dataTable: [
        {
          旅游类型: '国内旅游',
          人次占比: 93
        },
        {
          旅游类型: '入境旅游',
          人次占比: 1
        },
        {
          旅游类型: '出境旅游',
          人次占比: 6
        }
      ],
      fieldInfo: [
        {
          fieldName: '旅游类型',
          description: '旅游市场类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '人次占比',
          description: '旅游市场人次所占份额',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '《报告》显示，按照国内组织人次、入境外联人次、出境组织人次3项指标，国内旅游、入境旅游、出境旅游市场人次所占份额依次为93%、1%和6%。'
    },
    {
      text: `在国内旅游方面，2024年第二季度全国旅行社国内旅游组织4810.72万人次、12219.05万人天；接待4609.48万人次、10176.61万人天。国内旅游单项服务1.98亿人次。
出入境旅游方面，2024年第二季度全国旅行社入境旅游外联67.06万人次、253.76万人天；接待189.42万人次、644.16万人天。入境旅游单项服务113.15万人次。`,
      isEnglish: false,
      dataTable: [
        {
          旅游类型: '国内旅游',
          旅行社组织人次: 48107200,
          旅行社组织人天: 122190500,
          旅行社接待人次: 46094800,
          旅行社接待人天: 101766100,
          单项服务人次: 198000000
        },
        {
          旅游类型: '出入境旅游',
          旅行社组织人次: 670600,
          旅行社组织人天: 2537600,
          旅行社接待人次: 1894200,
          旅行社接待人天: 6441600,
          单项服务人次: 1131500
        }
      ],
      fieldInfo: [
        {
          fieldName: '旅游类型',
          description: '国内旅游或出入境旅游',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '旅行社组织人次',
          description: '旅行社组织的旅游人次',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '旅行社组织人天',
          description: '旅行社组织的旅游人天',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '旅行社接待人次',
          description: '旅行社接待的旅游人次',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '旅行社接待人天',
          description: '旅行社接待的旅游人天',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '单项服务人次',
          description: '单项服务的旅游人次',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ]
    },
    {
      dataTable: [
        {
          year: '2018',
          domestic_tourist_trips: 9000000000,
          international_arrivals: 1400000000,
          domestic_tourism_ratio: 600,
          asia_pacific_ratio: 50
        }
      ],
      fieldInfo: [
        {
          fieldName: 'year',
          description: 'The year the data was recorded',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: 'domestic_tourist_trips',
          description: 'Number of domestic tourist trips',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: 'international_arrivals',
          description: 'Number of international tourist arrivals',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: 'domestic_tourism_ratio',
          description: 'Ratio of domestic tourism to international tourism',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: 'asia_pacific_ratio',
          description: 'Percentage of domestic tourist trips in Asia and the Pacific',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: 'An estimated 9 billion domestic tourist trips (overnight visitors) were recorded around the world in 2018, of which well over 50% in Asia and the Pacific. Worldwide, domestic tourism is over six times bigger than international tourism (1.4 billion international arrivals in 2018) measured in number of tourist trips.'
    },
    {
      dataTable: [
        {
          year: 2009,
          CO2_emissions_per_inhabitant: 8
        },
        {
          year: 2011,
          CO2_emissions_per_inhabitant: 7.8
        }
      ],
      fieldInfo: [
        {
          fieldName: 'year',
          description: 'Year of the data',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: 'CO2_emissions_per_inhabitant',
          description: 'Average CO2 emissions per inhabitant',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: 'There was a slight reduction in CO2-emissions per inhabitant in the EU-27 between 2009 and 2011,\nfrom an average of 8.0 tonnes to 7.8 tonnes per inhabitant. Direct CO2-emissions from private\nhouseholds fell, on average, by 0.2 tonnes per inhabitant during this period. '
    }
  ]
};

const enegryData = {
  domain: 'energy',
  data: [
    {
      isEnglish: false,
      text: '总部位于阿布扎比的能源公司马斯达尔(Masdar)已完成以 14 亿美元从 Brookfield Renewable 手中收购独立可再生能源开发商 Saeta Yield 的交易。 马斯达尔在一份声明中表示，此次交易涉及 745 兆瓦的风电资产，以及 1.6 千兆瓦的开发项目。这还不包括受监管的 350 兆瓦聚光太阳能资产组合，布鲁克菲尔德将保留并继续运营这些资产。 此次出售是西班牙规模最大的交易之一，符合 Brookfield 的资产轮换战略，即回收资本以资助增长活动。这也符合 Masdar 加速欧洲能源转型的承诺，即到 2030 年实现全球 100 吉瓦的发电容量。 待获得必要的批准后，该交易预计将于 2024 年底完成。',
      fieldInfo: [
        {
          fieldName: '收购价格',
          description: '公司收购交易价格',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '风电',
          description: '发电量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '太阳能',
          description: '发电量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '开发项目',
          description: '发电量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          收购价格: 1400000000,
          风电: 745,
          太阳能: 350,
          开发项目: 1.6
        }
      ]
    },
    {
      isEnglish: false,
      text: '1—8月，新疆维吾尔自治区经济运行总体平稳。1—8月，规模以上工业增加值同比增长7.2%。从三大门类看，采矿业、制造业、电力热力燃气及水生产供应业增加值同比分别增长5.9%、6.7%、11.2 %。',
      fieldInfo: [
        {
          fieldName: '工业门类',
          description: '工业门类',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '同比增长',
          description: '工业同比增加值',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          工业门类: '规模以上',
          同比增长: 7.2
        },
        {
          工业门类: '采矿业',
          同比增长: 5.9
        },
        {
          工业门类: '制造业',
          同比增长: 6.7
        },
        {
          工业门类: '电力热力燃气及水生产供应业',
          同比增长: 11.2
        }
      ]
    },
    {
      isEnglish: false,
      text: '据悉，该公司位于加拿大萨斯喀彻温省，主要从事钾盐勘探开发，持有索西钾盐项目及其他四项钾盐矿权。其中，索西项目主要产品为氯化钾钾肥，其探明及控制的氯化钾储量为1.73亿吨，一期和二期设计产能分别为200万吨/年和80万吨/年，合计产能为280万吨/年。',
      fieldInfo: [
        {
          fieldName: '产能项目',
          description: '产能项目',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '设计产能',
          description: '设计产能',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          产能项目: '一期',
          设计产能: 2000000
        },
        {
          产能项目: '一期',
          设计产能: 800000
        },
        {
          产能项目: '总计',
          设计产能: 2800000
        }
      ]
    },
    {
      isEnglish: false,
      text: '《公示》显示，中广核新兴风电场“大代小”改造工程项目总装机90MW，拟拆除原风电场内46台0.85MW级风力发电机组，拟安装15台6MW级风力发电机组（机组实际单机容量以设备招标最终结果为准），风力发电机组通过35kV集电线路送至陆上升压站。',
      fieldInfo: [
        {
          fieldName: '总装机功率',
          description: '总装机功率',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '拆除功率',
          description: '拆除的风力发电机功率',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '拆除数量',
          description: '拆除的风力发电机数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '安装功率',
          description: '安装的风力发电机功率',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '安装数量',
          description: '安装的风力发电机数量',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '集电线路',
          description: '集电线路',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          总装机功率: 90,
          拆除功率: 0.85,
          拆除数量: 46,
          安装功率: 15,
          安装数量: 6,
          集电线路: 35
        }
      ]
    },
    {
      isEnglish: false,
      text: '煤炭是我国能源安全的“压舱石”。全国原煤产量分别于2021年、2022年跃上41亿吨、45亿吨台阶，2023年达到47.1亿吨，年均增长4.5%，原煤占我国一次能源生产总量的比重仍保持在65%以上。',
      fieldInfo: [
        {
          fieldName: '年份',
          description: '原煤产量年份',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '原煤产量',
          description: '原煤产量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          年份: '2021',
          原煤产量: 4100000000
        },
        {
          年份: '2022',
          原煤产量: 4500000000
        },
        {
          年份: '2021',
          原煤产量: 4710000000
        }
      ]
    },
    {
      isEnglish: false,
      text: '从中国铁路乌鲁木齐局集团有限公司获悉，截至9月18日，今年新疆铁路疆煤外运量超6000万吨，同比增长51%。今年以来，新疆铁路部门发运煤炭10500万吨、同比增长17.1%，其中疆煤外运6016.6万吨，为保障国家能源安全、服务区域经济社会发展提供了有力支撑。',
      fieldInfo: [
        {
          fieldName: '类型',
          description: '新疆铁路疆煤类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '运量',
          description: '煤炭运量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比',
          description: '同比',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          类型: '发运煤炭',
          运量: 105000000,
          同比: 17.1
        },
        {
          类型: '外运量',
          运量: 60166000,
          同比: 51
        }
      ]
    },
    {
      isEnglish: false,
      text: '隆众资讯预测，成品油本轮下调已板上钉钉，国内汽柴油下调幅度约为375元/吨。中新经纬梳理发现，年内成品油价已经历十八轮调整，呈现“七涨七跌四搁浅”，国内汽、柴油价格每吨较去年底分别提高150元、145元。目前，成品油年内最大下调幅度为汽油降305元/吨，柴油降290元/吨。若按机构测算，本轮调整或现年内最大跌幅。',
      fieldInfo: [
        {
          fieldName: '成品油类型',
          description: '成品油类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '预测下调幅度',
          description: '成品油类型',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '上升价格',
          description: '成品油较去年上升价格',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '年内最大下调幅度',
          description: '成品油类型',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          成品油类型: '汽油',
          预测下调幅度: 375,
          上升价格: 150,
          年内最大下调幅度: 305
        },
        {
          成品油类型: '柴油',
          预测下调幅度: 375,
          上升价格: 145,
          年内最大下调幅度: 290
        }
      ]
    },
    {
      isEnglish: false,
      text: '9月23日，从国网浙江省电力有限公司了解到，今年1到8月，浙江新增新能源装机818万千瓦。至8月底，省内新能源装机规模达到5054万千瓦，其中光伏装机4110万千瓦，风电装机636万千瓦。',
      fieldInfo: [
        {
          fieldName: '装机类型',
          description: '装机类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '功率',
          description: '发电功率',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          装机类型: '新增新能源装机',
          功率: 8180000
        },
        {
          装机类型: '新能源装机规模',
          功率: 50540000
        },
        {
          装机类型: '光伏装机规模',
          功率: 41100000
        },
        {
          装机类型: '风力装机规模',
          功率: 6360000
        }
      ]
    },
    {
      isEnglish: false,
      text: '欧洲汽车制造商协会（ACEA）当地时间19日公布的数据显示，欧盟8月份新车销量下滑18.3%，跌至三年来最低水平。主要市场德国、法国和意大利的销量均出现两位数的下滑，分别下跌27.8%、24.3% 和13.4%。',
      fieldInfo: [
        {
          fieldName: '市场区域',
          description: '市场区域',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '下滑销量',
          description: '新车下滑销量',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          市场区域: '欧盟',
          下滑销量: 18.3
        },
        {
          市场区域: '德国',
          下滑销量: 27.8
        },
        {
          市场区域: '法国',
          下滑销量: 24.3
        },
        {
          市场区域: '意大利',
          下滑销量: 13.4
        }
      ]
    },
    {
      isEnglish: false,
      text: '武建飞介绍，该硫化锂正极材料显示出每克1165.23毫安时的高比容量，接近理论值每克1167毫安时。在常温下循环6200次后，其容量仍可保持84.4%。搭配商业化的硅碳负极组装全电池后，常温下循环400次放电，电池比容量仍能保持在初始容量的97%以上。',
      fieldInfo: [
        {
          fieldName: '电池搭配',
          description: '是否搭配商业化的硅碳负极组装全电池',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '循环次数',
          description: '常温下循环次数',
          type: 'count',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '电池比容量',
          description: '电池比容量',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      dataTable: [
        {
          电池搭配: '搭配商业化的硅碳负极组装全电池',
          循环次数: 400,
          电池比容量: 97
        },
        {
          电池搭配: '无搭配',
          循环次数: '6200',
          电池比容量: 84.4
        }
      ]
    }
  ]
};

const eCommerceData = {
  domain: 'e-Commerce',
  data: [
    {
      isEnglish: false,
      dataTable: [
        {
          品类: '整体保暖服饰',
          同比增长: 105
        },
        {
          品类: '男/女士羽绒服',
          同比增长: 236
        },
        {
          品类: '儿童保暖内衣',
          同比增长: 135
        },
        {
          品类: '加绒裤',
          同比增长: 156
        },
        {
          品类: '围巾、手套、帽子套装',
          同比增长: 214
        },
        {
          品类: '冲锋衣裤',
          同比增长: 150
        }
      ],
      fieldInfo: [
        {
          fieldName: '品类',
          description: '服饰品类',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '同比增长',
          description: '成交额同比增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '京东整体保暖服饰成交额同比增长105%。其中，男/女士羽绒服成交额同比增长236%，儿童保暖内衣成交额同比增长135%，加绒裤成交额同比增长156%，围巾、手套、帽子套装成交额同比增长214%，冲锋衣裤成交额同比增长超150%。'
    },
    {
      dataTable: [
        {
          类别: '金银珠宝',
          同比增长率: 27.3
        },
        {
          类别: '烟酒',
          同比增长率: 19.1
        },
        {
          类别: '东北地区',
          同比增长率: 13.2
        },
        {
          类别: '中部地区',
          同比增长率: 8.7
        },
        {
          类别: '东部地区',
          同比增长率: 3.8
        },
        {
          类别: '西部地区',
          同比增长率: 3
        },
        {
          类别: '全国农村',
          同比增长率: 3.6
        }
      ],
      fieldInfo: [
        {
          fieldName: '类别',
          description: '商品或地区类别',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '同比增长率',
          description: '同比增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '金银珠宝、烟酒同比分别增长27.3%和19.1%。东北和中部地区网络零售额同比分别增长13.2%和8.7%，比全国增速分别高出9.2和4.7个百分点。东部和西部地区网络零售额同比分别增长3.8%和3%。全国农村网络零售额达2.17万亿元，同比增长3.6%'
    },
    {
      dataTable: [
        {
          类别: '全国农村网络零售额',
          零售额: 2170000000000,
          同比增长率: 3.6
        },
        {
          类别: '农村实物商品网络零售额',
          零售额: 1990000000000,
          同比增长率: 4.9
        },
        {
          类别: '全国农产品网络零售额',
          零售额: 531380000000,
          同比增长率: 9.2
        }
      ],
      fieldInfo: [
        {
          fieldName: '类别',
          description: '零售类别',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '零售额',
          description: '零售总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比增长率',
          description: '与去年同期相比的增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '农产品网络零售增势较好。全国农村网络零售额达2.17万亿元，同比增长3.6%。其中，农村实物商品网络零售额1.99万亿元，同比增长4.9%。全国农产品网络零售额5313.8亿元，同比增长9.2%，增速较2021年提升6.4个百分点'
    },
    {
      dataTable: [
        {
          国家: '马来西亚',
          最低销售额: 3000000,
          最高销售额: 12500000
        },
        {
          国家: '印度尼西亚',
          最低销售额: 3700000,
          最高销售额: 10500000
        },
        {
          国家: '菲律宾',
          最低销售额: 2700000,
          最高销售额: 6800000
        },
        {
          国家: '泰国',
          最低销售额: 4140000,
          最高销售额: 39140000
        },
        {
          国家: '越南',
          最低销售额: 2200000,
          最高销售额: 6070000
        },
        {
          国家: '美国',
          最低销售额: 2400000,
          最高销售额: 4300000
        }
      ],
      fieldInfo: [
        {
          fieldName: '国家',
          type: 'region',
          description: '国家名称',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '最低销售额',
          type: 'numerical',
          description: '头部达人最低销售额',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '最高销售额',
          type: 'numerical',
          description: '头部达人最高销售额',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '马来西亚：头部达人销售额普遍在300-1250万美元之间。\n\n印度尼西亚：头部达人销售额范围在370-1050万美元之间。\n\n菲律宾：头部达人销售额在270-680万美元之间。\n\n泰国：头部达人销售额差距较大，从414万到3914万美元不等。\n\n越南：头部达人销售额在220-607万美元之间。\n\n美国：头部达人销售额相对较低，在240-430万美元之间。'
    },
    {
      dataTable: [
        {
          品类: '直播带货',
          增长类型: '月均环比',
          增长率: 117
        },
        {
          品类: '宠物用品',
          增长类型: '直播增长',
          增长率: 239
        },
        {
          品类: '短视频带货',
          增长类型: '月均增长',
          增长率: 27
        },
        {
          品类: '儿童时尚',
          增长类型: '月均增速',
          增长率: 200
        }
      ],
      fieldInfo: [
        {
          fieldName: '品类',
          description: '商品品类',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '增长类型',
          description: '增长类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '增长率',
          description: '增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '直播带货规模持续扩大，月均环比增长117%，美妆个护、女装、手机数码为销量前三品类。宠物用品直播增长最快，达239%。短视频带货月均增长27%，儿童时尚品类增速最猛，月均增速高达200%。'
    },
    {
      dataTable: [
        {
          公司: 'TikTok Shop',
          销售额占比: 37
        },
        {
          公司: 'Temu',
          销售额占比: 37.2
        },
        {
          公司: 'Shein',
          销售额占比: 25.8
        }
      ],
      fieldInfo: [
        {
          fieldName: '公司',
          description: '公司名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销售额占比',
          description: '销售额占美国电商销售额的比例',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: 'TikTok Shop 的 Deals for You Days活动期间的销售额占美国电商销售额的 37%，这表明夏季销售额将迎来增长。与此同时，Temu 的这一比例为 37.2%，Shein 为 25.8%'
    },
    {
      dataTable: [
        {
          年份: '2018E',
          GMV: 4716000000000,
          综合变现率: 2.8,
          预期收入: 133000000000,
          'P/GMV': 0.47,
          'P/S': 16.66
        },
        {
          年份: '2019E',
          GMV: 9621000000000,
          综合变现率: 3.1,
          预期收入: 298000000000,
          'P/GMV': 0.23,
          'P/S': 7.46
        },
        {
          年份: '2020E',
          GMV: 14936000000000,
          综合变现率: 3.4,
          预期收入: 507000000000,
          'P/GMV': 0.15,
          'P/S': 4.38
        }
      ],
      fieldInfo: [
        {
          fieldName: '年份',
          description: '预测年份',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: 'GMV',
          description: '商品交易总额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '综合变现率',
          description: '预期综合变现率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '预期收入',
          description: '预期收入',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: 'P/GMV',
          description: '市值与商品交易总额的比率',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: 'P/S',
          description: '市值与收入的比率',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '拼多多 2018E、2019E、2020E 的 GMV 分别为 4716(A)、9621、14936 亿\n元，预期综合变现率 2.8%、3.1%、3.4%，对应预期收入 133、298、507\n亿元。按 2 月 20 日收盘价 29.09 美元计算(按 6.7 汇率，折合 2,140 亿\n元市值)，拼多多 2018E、2019E、2020E 的 P/GMV 分别为 0.47X、0.23X、\n0.15X，P/S 分别为 16.66X、7.46X、4.38X。'
    },
    {
      dataTable: [
        {
          平台: '天猫',
          销售额占比: 60.02,
          销售额: 554300000000
        },
        {
          平台: '京东',
          销售额占比: 27.86,
          销售额: 257300000000
        },
        {
          平台: '拼多多',
          销售额占比: 7.34,
          销售额: 67800000000
        },
        {
          平台: '其他渠道',
          销售额占比: 4.77,
          销售额: 44100000000
        }
      ],
      fieldInfo: [
        {
          fieldName: '平台',
          description: '电商平台名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销售额占比',
          description: '双11当天各平台销售额占比',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '销售额',
          description: '双11当天各平台销售额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '如果按双11当天（准确地说是11月10日20:00至11月11日24:00）销售额各家的占比——天猫占比60.02%、京东27.86%、拼多多7.34%，其他渠道占比4.77%来测算，今年双11综合电商平台的销售额分别为：天猫5543亿元、京东2573亿元、拼多多678亿元、其他441亿元。'
    },
    {
      dataTable: [
        {
          平台: '直播电商',
          销售额: 215100000000,
          同比增长: 18.58,
          去年增速: 146.1
        },
        {
          平台: '新零售',
          销售额: 23600000000,
          同比增长: 8.26,
          去年增速: 10.8
        },
        {
          平台: '社区团购',
          销售额: 12400000000,
          同比增长: -8.15,
          去年增速: null
        }
      ],
      fieldInfo: [
        {
          fieldName: '平台',
          description: '电商平台类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '销售额',
          description: '平台销售额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '同比增长',
          description: '平台销售额同比增长率',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '去年增速',
          description: '平台去年销售额增速',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '直播电商平台销售额为2151亿元，是贡献双11整体销售额增长2.08%的主力。但是它今年也仅仅同比增长18.58%，而去年它的增速高达146.1%。新零售相对比较稳定，销售额236亿元，同比增长8.26%（去年增速为10.8%）。而社区团购表现更差，销售额只有124亿元，比去年的135亿元下跌了8.15%。'
    },
    {
      dataTable: [
        {
          年份: 2009,
          平台: '淘宝',
          双11销售额: 52000000
        },
        {
          年份: 2010,
          平台: '淘宝',
          双11销售额: 936000000
        },
        {
          年份: 2011,
          平台: '淘宝',
          双11销售额: 3360000000
        },
        {
          年份: 2012,
          平台: '天猫',
          双11销售额: 19100000000
        },
        {
          年份: 2013,
          平台: '天猫和淘宝',
          双11销售额: 35000000000
        }
      ],
      fieldInfo: [
        {
          fieldName: '年份',
          description: '具体年份',
          type: 'date',
          dateGranularity: 'year',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '平台',
          description: '电商平台名称',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '双11销售额',
          description: '双11当天的销售额',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '回顾2009年，淘宝发起首届双11，第一年的GMV仅5200万，只有27个品牌参加。但2010年的双11，销售额便飙升到9.36亿元；2011年，这一数字变成了33.6亿元；2012年，淘宝商城正式更名为天猫，线上总成交额达到191亿元；2013年双11，天猫和淘宝的交易额更是翻倍至350亿'
    }
  ]
};

const transposition = {
  domain: 'transposition',
  data: [
    {
      isEnglish: false,
      dataTable: [
        {
          日期: '8月30日',
          指数值: 980.58,
          变化类型: '比上月末',
          变化值: 0.4
        },
        {
          日期: '8月30日',
          指数值: 973.34,
          变化类型: '环比',
          变化值: 2
        }
      ],
      fieldInfo: [
        {
          fieldName: '日期',
          description: '具体日期',
          type: 'date',
          dateGranularity: 'day',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '指数值',
          description: '指数的具体值',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '变化类型',
          description: '指数变化的类型',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '变化值',
          description: '指数变化的值',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '8月，沿海内贸终端补库节奏放缓，但受台风、内贸运力外放等因素影响，即期运力略有收紧，沿海散货综合指数走势平稳。8月30日，上海航运交易所发布的沿海（散货）综合运价指数报收980.58点， 比上月末上涨0.4%，月平均值为973.34点， 环比上涨0.2%。'
    },
    {
      isEnglish: false,
      dataTable: [
        {
          公路等级: '四级及以上等级公路',
          里程: 5270100,
          里程增加: 107600,
          里程比重: 96.9,
          比重提高: 0.5
        },
        {
          公路等级: '二级及以上等级公路',
          里程: 762200,
          里程增加: 18600,
          里程比重: 14,
          比重提高: 0.1
        },
        {
          公路等级: '高速公路',
          里程: 183600,
          里程增加: 6400,
          里程比重: null,
          比重提高: null
        },
        {
          公路等级: '国家高速公路',
          里程: 122300,
          里程增加: 2400,
          里程比重: null,
          比重提高: null
        }
      ],
      fieldInfo: [
        {
          fieldName: '公路等级',
          description: '公路的等级',
          type: 'string',
          role: 'dimension',
          location: 'dimension'
        },
        {
          fieldName: '里程',
          description: '公路的里程',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '里程增加',
          description: '公路里程的增加量',
          type: 'numerical',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '里程比重',
          description: '公路里程占总里程的比重',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        },
        {
          fieldName: '比重提高',
          description: '公路里程比重的提高量',
          type: 'ratio',
          role: 'measure',
          location: 'measure'
        }
      ],
      text: '年末全国四级及以上等级公路里程527.01万公里，比上年末增加10.76万公里，占公路里程比重为96.9%、提高0.5个百分点。其中，二级及以上等级公路里程76.22万公里、增加1.86万公里，占公路里程比重为14.0%、提高0.1个百分点；高速公路里程18.36万公里、增加0.64万公里，国家高速公路里程12.23万公里、增加0.24万公里'
    }
  ]
};

export const dataExtractionCommonDataset = [
  economyData,
  technologyData,
  environmentData,
  cultureSportsData,
  agricultureData,
  retailData,
  travelData,
  realEstateData,
  newTravelData,
  enegryData,
  transposition,
  eCommerceData
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
