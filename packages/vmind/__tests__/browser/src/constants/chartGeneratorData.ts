/* eslint-disable max-len */
export const chartGenerationMockData = [
  {
    llm: 'gpt-4o-2024-05-13',
    result: [
      {
        context: {
          dataTable: [
            {
              年份: 2024,
              党派: '左翼联盟',
              席位数: 182
            },
            {
              年份: 2024,
              党派: '新人民战线',
              席位数: 168
            },
            {
              年份: 2024,
              党派: '极右翼国民联盟',
              席位数: 143
            },
            {
              年份: 2024,
              党派: '右翼共和党',
              席位数: 48
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '选举年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '党派',
              description: '党派名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '席位数',
              description: '党派获得的席位数',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '地图带你看懂法国大选。 2024 年法国议会选举结果揭示了法国社会的撕裂，没有任何党派能获得 577 个议题中的绝对多数。左翼联盟、新人民战线执政党中间派联盟和极右翼国民联盟分别占据 182 席、 168 席、 143 席。除了这三家以外，其余党派席位最多的也只有右翼共和党的 48 席，因此左翼联盟、执政党和极右翼算是形成了三分天下的格局。今天我们便结合地图和数据，聊一聊法国大选。本期视频的所有分析均为个人观点，仅供参考。在开始之前，我先快速的放一下各党派在几个主要政治议题上的立场，有需要的朋友可以截图保存一下。'
        }
      },
      {
        context: {
          dataTable: [
            {
              国家: '法国',
              选区数量: 577,
              选区人口范围: [100000, 120000],
              城市: '巴黎'
            },
            {
              国家: '法国',
              选区数量: 577,
              选区人口范围: [100000, 120000],
              城市: '里昂'
            },
            {
              国家: '法国',
              选区数量: 577,
              选区人口范围: [100000, 120000],
              城市: '马赛'
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
              fieldName: '选区数量',
              description: '全国选区的总数',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '选区人口范围',
              description: '每个选区的人口范围',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '城市',
              description: '人口密集的大城市',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '现在我们进入正题，首先需要说明法国的选区制度，全国共有 577 个选区，每个选区包括 10- 12 万的人口密集的地方选区就小，人口稀少的区域选区域就大。因此地图上各个政党所占的面积并不能与其票数划等号，而是要看具体的选区分布在人口密集的大城市，譬如巴黎、里昂、马赛，虽然看起来面积小，实际上选区数量很多，占的比重很大。'
        }
      },
      {
        context: {
          dataTable: [
            {
              地区: '西北部',
              失业率年份: '2022',
              失业率排名: [1, 40]
            },
            {
              地区: '东北部',
              失业率年份: '2022',
              失业率排名: null
            },
            {
              政党: '左翼联盟新人民战线',
              席位数: 182
            },
            {
              政党: '马克龙的执政党中间派联盟',
              席位数: 168
            },
            {
              政党: '乐旁的极右翼国民联盟',
              席位数: 143
            },
            {
              政党: '右翼共和党',
              席位数: 48
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '法国的不同地区',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '失业率年份',
              description: '失业率数据对应的年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '失业率排名',
              description: '失业率排名',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '政党',
              description: '政党名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '席位数',
              description: '政党获得的席位数',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '尽管如此，马克龙强调市场自由化，支持创新和创业，对欧盟一体化和国际合作的开放还是得到了许多大城市选民的支持。大城市仍然是马克龙的重要支持来源。除了大城市外，我们刚才提到过法国东北地区工业的衰落，其实在法国的西北地区又是另一番景象。之前那张关于中小工业城市分布的途中，我们可以清晰的看到西北地区的工业对于当代法国的重要性，当然工业只是一个缩影。我们再来看失业率地图，黄色代表 2022 年失业率最低的 20 个省，橙色是 21- 40 低的省份，可以看出西北部地区的失业率明显低于东北部。再看移民分布地图，西北部地区因为大城市少，而且离地中海更远，接受的移民也比较少。综上，西北地区的经济较为稳定，而且不受移民带来的社会问题困扰，日子过得比较舒服，这些选民对于未来持乐观态度，也成为了马克龙的另一主要票仓。除了以上三大势力外，浅蓝色代表的右翼共和党也获得了 48 个席位。他们的支持者主要位于经济同样比较富足，但是政治观点更为保守的地区。这里我就不展开讲总结。本期视频我们从法国官方的报告与数据出发，从经济与人口地理的角度分析了法国的大选结果。左翼联盟新人民战线以大城市为根基拿下最多的 182 席，马克龙的执政党中间派联盟则凭借大城市和西北地区的支持者取得了 168 席。乐旁的极右翼国民联盟则主要扎根于东北与东南地区，以 143 起居于第三这样的三分割据局面使得法国议会缺乏绝对多数，并且三方势力相差不大。可以预见在未来法案的通过上会面临极大的阻碍。举例来说，左翼和极右翼甚至存在联手撤回延迟退休法案的理论可能。虽然实际操作起来也面临很多困难，双方都不太愿意和对方合作，但即便是理论，可能也已经能表明未来的不确定性。'
        }
      },
      {
        context: {
          dataTable: [
            {
              公司: '星巴克',
              季度: '第二季度',
              营业收入: 8560000000,
              同比变化: -2,
              净利润变化: -15,
              股票市值变化: -115000000000
            }
          ],
          fieldInfo: [
            {
              fieldName: '公司',
              description: '公司名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '季度',
              description: '财报季度',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '营业收入',
              description: '公司的营业收入',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '同比变化',
              description: '与去年同期相比的变化',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '净利润变化',
              description: '净利润的变化',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '股票市值变化',
              description: '股票市值的变化',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '住手，你们住手，不要再砸了，你们不要再砸了。万万没想到，瑞幸和库迪的九块九大战，快把星巴克给卷死了。前段时间，星巴克公布了第二季度财报，营业收入 85.6 亿美元，同比下降了2%，净利润大跌15%，股票市值一天内蒸发了 1, 150 亿人民币。另一方面，星巴克的咖啡也在悄悄降价。如果你手机上有星巴克的APP，几乎每天都会收到 5 张以上的优惠券，比如满60.10、满75.15、任意新冰乐 7 折等等，部分单品的团购价优惠下来低至 9 元。终于， 9.9 的风还是卷到了星巴克。在过去很长一段时间里，星巴克是小资生活的代表，一杯咖啡动辄几十块钱，也只有电视剧里那些白领们和云淡风轻的走进去，熟练地点一杯拿铁，找个位置坐下，悠闲地打开电脑喝咖啡。岁月静好人间，值得有人点一杯星巴克，朋友圈能发十几条动态，有人为了抢星巴克限量版的猫爪杯，能通宵排队，甚至大打出手。'
        }
      },
      {
        context: {
          dataTable: [
            {
              国家: '中国',
              品牌定位: '高端咖啡',
              饮品价格: 30,
              平均月工资: null,
              最低时薪: null,
              主力消费人群月薪: 60000
            },
            {
              国家: '美国',
              品牌定位: '平民咖啡',
              饮品价格: 2.95,
              平均月工资: 6228,
              最低时薪: 7.25,
              主力消费人群月薪: null
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
              fieldName: '品牌定位',
              description: '品牌在该国家的市场定位',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '饮品价格',
              description: '一杯星巴克饮品的价格',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '平均月工资',
              description: '该国家的平均月工资',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '最低时薪',
              description: '该国家的最低时薪',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '主力消费人群月薪',
              description: '按照美国的对应消费力，星巴克在中国的主力消费人群月薪',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '星巴克在中国国内的定位一直都是高端咖啡品牌，但是很多人不知道的是，它在国外的定位其实是平民咖啡，在美国一杯星巴克大杯美式咖啡大概是 2.95 美元，而根据美国劳工部的统计，美国平均月工资是 6, 228 美元，最低时薪是 7.25 美元，这是啥意思呢？ 1002.65 美元的星巴克还不到美国人平均月收入的 2, 000 份之一，也就是平常坐一趟地铁的价格吧。而在中国市场，星巴克的饮品价格普遍要超过 30 元一杯。如果按照美国的对应消费力，它的主力消费人群应该是月薪至少6万元的人。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2019',
              月份: '2',
              商品: '粉爪杯',
              售价: 199,
              最高价格: 1800
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '具体年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '月份',
              description: '具体月份',
              fieldType: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '商品',
              description: '商品名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '售价',
              description: '商品的原始售价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '最高价格',
              description: '商品在网上的最高价格',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '2019 年2月，星巴克就发售了一款粉爪杯，那它长这样？售价 199 元，但是在网上最高炒到了 1, 800 元。有人寒冬腊月在星巴克门口通宵排队，就是为了买到这么一个杯子。还有人因为排队顺序大打出手，最后喜提免费食宿。靠着这些营销方法，在很长一段时间里，普通人对于星巴克是仰望的，觉得去星巴克消费是很有品的，再往前推十年，你甚至可以看到有人去星巴克点一杯咖啡就可以发十几条朋友圈的各种角度各种场景，还要配文低调有实力，天天喝都喝腻了好像呢？甚至有人专门发帖认真的提问，第一次去星巴克主要注意什么？怎么装的像老手呢？我一开始还以为是来搞笑和反讽的，没想到点开帖子此还真的是教大家怎么去星巴克抓老手的，包括但不限于怎么下载APP，问店员这周用的是啥肚子萃取时间是多少？张度和烘焙度怎么样？要不要加糖和加奶？这唬得我一愣一愣的，但是时过境迁，如今星巴克已经支棱不起来了，一边是疯狂降价买三送一搞促销，一边是继续下沉到四五线城市。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2025',
              市场类型: 'd级市场',
              市场数量: 300
            },
            {
              年份: '2025',
              市场类型: '县域市场',
              市场数量: 3000
            },
            {
              年份: '2025',
              门店数量: 7000
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '战略愿景发布的年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场类型',
              description: '市场的类型',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场数量',
              description: '市场的数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '门店数量',
              description: '星巴克在中国的门店数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '星巴克近期发布的 2025 中国战略愿景当中，中国总部直言不讳地表示，星巴克看中的不仅仅是全国 300 多个 d 级市场，也包括近 3, 000 个县域市场。星巴克的愿景也体现在它的选址变化上，它在中国的门店已经突破了 7, 000 家，但是这开店位置却让人越来越看不懂了。'
        }
      },
      {
        context: {
          dataTable: [],
          fieldInfo: [],
          text: '一家卖咖啡的店。星巴克没落的第二个原因是当代年轻人更偏向实用消费主义。坦白讲，大部分人喝咖啡其实就是为了遮住那点咖啡因，好让自己在一天的工作中保持清醒。你跟不懂咖啡的人聊什么豆子产地、风味，他只会回你一句，冰美式和中药有什么区别啊？如果你面前有三杯咖啡，第一杯是星巴克的 30 元美式，后面两杯是瑞幸库里的 9 块 9 咖啡也让你买单，大部分人都会选择后面两个，当然也有人会吹星巴克的豆子有多么多么的好，所以它买的这么贵也是值得的。'
        }
      },
      {
        context: {
          dataTable: [
            {
              月份: '6月',
              指标: 'M2',
              同比增长率: 6.2,
              预期增长率: 6.8
            },
            {
              月份: '6月',
              指标: 'M1',
              同比增长率: -5,
              预期增长率: -5.4
            },
            {
              月份: '6月',
              指标: 'M2-M1',
              剪刀差: 11.2
            },
            {
              月份: '6月',
              指标: '人民币存款',
              人民币存款增加: 2460000000000,
              居民存款增加: 2140000000000
            },
            {
              时间范围: '上半年',
              指标: '人民币存款',
              人民币存款增加: 11460000000000,
              居民存款增加: 9270000000000
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
              fieldName: '指标',
              description: '经济指标',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '同比增长率',
              description: '同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '预期增长率',
              description: '预期增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '人民币存款增加',
              description: '人民币存款增加量',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '居民存款增加',
              description: '居民存款增加量',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '剪刀差',
              description: 'M2与M1的剪刀差',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '时间范围',
              description: '数据对应的时间范围',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '咱聊一下最新的重磅数据，反正挺复杂的，国内6月 M2 同比增长6.2%，预期6.8%。 M1 同比下滑5%，预期下滑5.4%。 M M 一剪刀差走扩至 11.2% 再创新高。6月人民币存款增加 2.46 万亿，其中居民存款增加 2.14 万亿，增量几乎全都是老百姓存的。与 M1 的下滑相对，上半年人民币存款总共增加了 11.46 万亿，其中居民存款增加 9.27 万亿。大头也是老百姓，但增速逐月放缓。'
        }
      },
      {
        context: {
          dataTable: [
            {
              日期: '7月11日',
              事件: '美国公布CPI数据超预期回落',
              降息预期概率: null,
              不降息预期概率: null
            },
            {
              日期: '7月30日',
              事件: '美联储议息会议',
              降息预期概率: null,
              不降息预期概率: 93
            },
            {
              日期: '9月18日',
              事件: '美联储议息会议',
              降息预期概率: 90,
              不降息预期概率: null
            },
            {
              日期: '7月10日',
              事件: '美联储鲍威尔国会听证会',
              降息预期概率: null,
              不降息预期概率: null
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
              fieldName: '事件',
              description: '事件描述',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '降息预期概率',
              description: '市场预期降息的概率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '不降息预期概率',
              description: '市场预期不降息的概率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '7月 11 日晚上，由于美国公布的 CPI 数据超预期回落，让市场对美联储降息预期大幅升温。从这场所的美联储观察工具看，虽然7月 30 一日的美联储议息会议，市场预期不降息的概率仍然是达到93%，但9月 18 日的美联储议息会议，市场预期降息一次的概率是达到90%，这比起上个月概率是上升很多。不过我还是得强调一下，这个美联储观察工具将来只能反映市场当前的预期态度，不能拿来预测美联储货币政策，因为这个概率是会不断随着最新经济数据变化而变化。比如要是下个月美国 CPI 出现较大反弹，那9月降息的概率就会大幅下降。而这次市场预期美联储9月降息的概率大幅上升，主要有两个原因，一、美联储鲍威尔在7月 10 日的国会听证会上整体态度偏戈。鲍威尔称，劳动力市场降温意味着持续高通胀的潜在源头已经减弱。他还表示，就业市场的进一步疲软可能是不必要的，也是不受欢迎的。鲍威尔说，通胀方面的工作还没有完成，我们还有更多工作要做，但与此同时，我们需要注意劳动力市场现况，我们已经观察到劳动力市场出现相当明显的疲软，有着新美联储通讯社之称的知名记者尼奇默尔斯认为，鲍威尔本周其实已暗示美联储的利率政策即将开始改变方向。'
        }
      },
      {
        context: {
          dataTable: [
            {
              日期: '2024-07-11',
              月份: '6月',
              CPI同比: 3,
              市场预期CPI同比: 3.1,
              前值CPI同比: 3.3,
              CPI环比: -0.1
            },
            {
              日期: '2020-05',
              月份: '5月',
              CPI同比: null,
              市场预期CPI同比: null,
              前值CPI同比: null,
              CPI环比: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '日期',
              description: '数据公布的日期',
              fieldType: 'date',
              dateGranularity: 'day',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '月份',
              description: '具体月份',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'CPI同比',
              description: 'CPI同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场预期CPI同比',
              description: '市场预期的CPI同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '前值CPI同比',
              description: '前值的CPI同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'CPI环比',
              description: 'CPI环比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '第二个原因是7月 11 日晚上 8 点半美国劳工部公布的通胀数据，6月 CPI 是同比上涨3%，市场预期值3.1%，前值3.3%。这次美联储 CPI 回落，更关键是 CPI 环比是负增长0.1%，这是美国 2020 年5月以来 CPI 环比首次出现下降，而且美国 2020 年5月还是因为疫情导致的 CPI 骤降，是比较特殊时期，所以美国 CPI 环比负增长确实不太常见。但仔细看美国 VI 月 CPI 的具体构成，感觉猫腻还是不少的。'
        }
      },
      {
        context: {
          dataTable: [
            {
              国家: '美国',
              月份: '6月',
              指标: '汽油价格',
              变化率: -3.8
            },
            {
              国家: '美国',
              月份: '6月',
              指标: '食品和住房价格',
              变化率: 0.2
            },
            {
              国家: '美国',
              月份: '6月',
              指标: '核心通胀率',
              变化率: 3.3
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
              fieldName: '月份',
              description: '具体月份',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '指标',
              description: '经济指标',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '变化率',
              description: '变化的百分比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '美国 VI 月 CPI 下降的主要贡献是汽油价格下跌。美国 VI 月汽油价格下跌了3.8%，抑制了当月通胀，抵消了食品和住房价格 0.2% 的上涨。比较诡异的是，美国原油期货价格6月是明明出现大幅上涨，这是因为原油期货价格传导到汽油价格有一些迟滞效应，但那样的话，下个月公布的 CPI 数据，汽油价格可能就得反弹了。要是下个月公布的 CPI 数据，汽油价格还继续下降，那就实在说不过去了。美国刨除能源和食品价格的核心通胀率6月是3.3%，但整体降幅还是低于CPI。'
        }
      },
      {
        context: {
          dataTable: [
            {
              国家: '美国',
              月份: '6月',
              服务业通胀同比: 5,
              非农就业人口: 206000,
              市场预期非农就业人口: 190000,
              修正前非农就业人口: null,
              修正后非农就业人口: null,
              修正月份: null,
              修正前后差值: null
            },
            {
              国家: '美国',
              月份: '5月',
              服务业通胀同比: null,
              非农就业人口: null,
              市场预期非农就业人口: null,
              修正前非农就业人口: 272000,
              修正后非农就业人口: 218000,
              修正月份: '5月',
              修正前后差值: -54000
            },
            {
              国家: '美国',
              月份: '4月',
              服务业通胀同比: null,
              非农就业人口: null,
              市场预期非农就业人口: null,
              修正前非农就业人口: 165000,
              修正后非农就业人口: 108000,
              修正月份: '4月',
              修正前后差值: -57000
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
              fieldName: '月份',
              description: '具体月份',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '服务业通胀同比',
              description: '服务业通胀同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '非农就业人口',
              description: '非农就业人口数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场预期非农就业人口',
              description: '市场预期的非农就业人口数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '修正前非农就业人口',
              description: '修正前的非农就业人口数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '修正后非农就业人口',
              description: '修正后的非农就业人口数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '修正月份',
              description: '修正数据的月份',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '修正前后差值',
              description: '修正前后的差值',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '美国通胀目前最顽固的就是服务业通胀，美国 VI 月服务业通胀仍然是同比上涨5%。美国毕竟是服务业为主的国家，服务业通胀还高居5%，美国要说自己已经控制住通胀，完全就是忽悠人。不过虽然美国大选临近，美国现在经济数据基本是为选型服务，比如已经假的不能再假的美国非农就业数据，美国 VI 月非农就业人口增加20.6万人，高于市场预期的 19 万人。然而美国同时把5月数据从 27.2 万人大幅下修至 21.8 万人，4月从 16.5 万人修正至10.8万人，修正后两个月合计较修正前减少 11.1 万人。'
        }
      },
      {
        context: {
          dataTable: [
            {
              日期: '2023-07-11',
              股市: '纳斯达克',
              涨跌幅: -2
            },
            {
              日期: '2023-07-12',
              股市: '日股',
              涨跌幅: -2.45
            },
            {
              年份: '2004',
              事件: '美联储降息'
            },
            {
              年份: '2006',
              事件: '美联储停止加息'
            },
            {
              年份: '2007',
              事件: '美联储开始降息'
            },
            {
              年份: '2007',
              事件: '股市大跌'
            },
            {
              年份: '2022',
              事件: '美联储开始加息'
            },
            {
              年份: '2024-2026',
              事件: '可能爆发世界金融危机'
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
              fieldName: '股市',
              description: '股市名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '涨跌幅',
              description: '股市涨跌幅度',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '年份',
              description: '年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '事件',
              description: '事件描述',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '我注意到虽然这次市场大幅提高了美联储9月降息概率，但美股和日股反而不涨反跌，纳斯达克在7月 11 日是下跌了2%，日股在7月 12 日也跟随下跌了2.45%。这是市场反身性效应的某种预演，股市炒的是预期，之前美股和日股是基于美联储降息预期，已经提前涨了一年多了，那么当美联储真正降息之后，市场是可能出现反身性效应，也就是所谓利好落地势利空的说法。当然股市走势千变万化，这也只是其中一种可能性。历史的参考例子，比如 2004 年美联储降息， 2006 年停止加息， 2007 年开始降息，但股市是一直涨到 2007 年底，随后自带危机爆发，股市开始大跌。我之前也梳理过，从 1980 年以来，美联储每次加息超过 5% 的幅度，首次加息后的 2- 4 年内都会爆发金融危机，这次美联储是 2022 年开始加息，所以按照历史路径， 2024 年到 2026 年是有可能爆发世界金融危机，这个结合当前国际局势和地缘形势，还是有挺大的可能性。'
        }
      },
      {
        context: {
          dataTable: [
            {
              地区: '黑龙江省',
              时间范围: '10年',
              荒废小学数量: 1900,
              荒废比例: 60
            },
            {
              地区: '东北',
              时间范围: '10年',
              荒废小学数量: 6800,
              荒废比例: 50
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '地理区域',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间范围',
              description: '时间跨度',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '荒废小学数量',
              description: '荒废的小学数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '荒废比例',
              description: '荒废的小学占总数的比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '以前的小学空荡荡的，老年人养起了鸡鸭鹅狗，彻底荒废了整个黑龙江省， 10 年时间荒废了近六成，小学加起来有 1, 900 余所，整个东北十年荒废了 6, 800 余所小学，少了一半。'
        }
      },
      {
        context: {
          dataTable: [
            {
              地区: '河南',
              年份: '2023-2027',
              小学学龄人口预计下降: 2000000,
              小学学龄人口预计下滑比例: 20
            },
            {
              地区: '全国',
              年份: null,
              小学学龄人口预计下降: null,
              小学学龄人口预计下滑比例: 90
            },
            {
              地区: '上海',
              年份: null,
              小学学龄人口预计下降: null,
              小学学龄人口预计下滑比例: null,
              总和生育率: 60
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '具体地区',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '小学学龄人口预计下降',
              description: '小学学龄人口预计下降人数',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '小学学龄人口预计下滑比例',
              description: '小学学龄人口预计下滑比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '总和生育率',
              description: '总和生育率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '而小学缺孩子这个趋势早已经蔓延至全国各地了。东部的兹西县，有的小学一个班只有一个学生。华南的徐文县，去年某小学开学，一年级也只有一个学生。中部人口大省河南，据测算， 2023- 2027 年小学学龄人口预计下降 200 多万人，缩水超两成，出现了基数的坍塌。从全国来看，基于学龄人口的预测显示，全国超 1, 400 个县域中，近九成县域小学学龄人口预计下滑，小学鹤岗化以谁也没想到的方式在扩散，从东北开始到大江南北，下一步可能是上海最新的总和生育率只有 0.6 了，该来的总是要来，从民政局冷冷清清到妇产科缺孩子，再到幼儿园关停潮，现在轮到了小学关停潮，这个传播链条还在扩散。'
        }
      },
      {
        context: {
          dataTable: [
            {
              省份: '广东',
              城市: '惠州',
              房价: 60000
            },
            {
              省份: '广西',
              城市: '南宁',
              房价: 50000
            },
            {
              省份: '山东',
              城市: '东营',
              房价: 40000
            },
            {
              省份: '江苏',
              城市: '南京',
              房价: 30000
            },
            {
              省份: '黑龙江',
              城市: '大靶',
              房价: 10000
            },
            {
              省份: '北京',
              城市: '京津交界处',
              楼盘: '抹楼盘',
              原价: 1600000,
              现价: 390000
            }
          ],
          fieldInfo: [
            {
              fieldName: '省份',
              description: '省份名称',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '城市',
              description: '城市名称',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '房价',
              description: '一套房的总价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '楼盘',
              description: '楼盘名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '原价',
              description: '楼盘原价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '现价',
              description: '楼盘现价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '实际上，如果鹤岗化只是局限于教育领域，那还好说，但不是实际情况复杂的多楼市，像鹤岗那样房子白菜价的城市越来越多了，据不完全统计，至少有 10 个省 24 个城市陷入几万元买房的讨论。不是每平方米单价几万，而是一套房总价几万。网传广东惠州6万，广西南宁5万，山东东营4万，江苏南京3万，黑龙江大靶1万，这个传播势头在这轮楼市调整的加持下，现在已经来到了北京的外围，在京津两市的交界处，抹楼盘从 160 万元降到了 39 万，而且打了骨折还卖不出去。'
        }
      },
      {
        context: {
          dataTable: [
            {
              地区: '秦岭深处某县',
              人口: 30000,
              编制人员数量: 2194,
              行政管理支出: 18000000,
              一般公共预算收入: null,
              工资预算总支出: null,
              在职人员工资支出: null,
              离退休人员工资支出: null,
              零聘人员工资支出: null,
              在职人员数量: null,
              临聘人员数量: null
            },
            {
              地区: '乌蒙山区某县',
              人口: null,
              编制人员数量: null,
              行政管理支出: null,
              一般公共预算收入: 700000000,
              工资预算总支出: 2630000000,
              在职人员工资支出: 2000000000,
              离退休人员工资支出: 170000000,
              零聘人员工资支出: 460000000,
              在职人员数量: 15000,
              临聘人员数量: 28000
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '具体的地理区域',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '人口',
              description: '地区人口数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '编制人员数量',
              description: '编制内人员数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '行政管理支出',
              description: '一年的行政管理支出',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '一般公共预算收入',
              description: '一般公共预算收入',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '工资预算总支出',
              description: '工资预算总支出',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '在职人员工资支出',
              description: '在职人员工资支出',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '离退休人员工资支出',
              description: '离退休人员工资支出',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '零聘人员工资支出',
              description: '零聘人员工资支出',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '在职人员数量',
              description: '在职人员数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '临聘人员数量',
              description: '临聘人员数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '地方财力，之前鹤岗是全国第一个财政重整的地级市，甚至传出来停招公务员，现在过紧日子的城市也越来越多了。秦岭深处某县人口只有3万，编制人员却有 2, 194 名，一年的行政管理支出 1, 800 万，排在支出的首位。乌蒙山区某县一般公共预算收入 7 个亿，但工资预算总支出 26.3 亿，其中在职人员 20 亿，离退休人员 1.7 亿，零聘人员 4.6 亿。注意一个细节，在职人员数量 1.5 万，临聘人员数量 2.8 万。'
        }
      },
      {
        context: {
          dataTable: [
            {
              城市: '深圳',
              年份: '2021',
              房价跌幅: -40
            }
          ],
          fieldInfo: [
            {
              fieldName: '城市',
              description: '城市名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '房价跌幅',
              description: '房价跌幅百分比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国房价一度被视为坚不可摧的资产堡垒，更一度有京沪永远涨的口号。然而，自 2021 年以来，包括一线城市在内，房价持续低迷，深圳全市二手房均价距离 2021 年初的最高点跌幅已接近40%，而且还没有停下来的意思。各热点城市二手房每成交一套就要多出好几套，新增的房源和房价表现几乎完全正相关的是飞天茅台的价格， 53 度。'
        }
      },
      {
        context: {
          dataTable: [
            {
              商品: '飞天茅台',
              年份: '2021',
              价格: 3500
            },
            {
              商品: '飞天茅台',
              年份: '2024',
              价格: 2000
            },
            {
              商品: '一线房产',
              年份: '2012',
              价格: null
            },
            {
              商品: '飞天茅台',
              年份: '2012',
              价格: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '商品',
              description: '商品名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格',
              description: '商品价格',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '飞天茅台在 2021 年巅峰时期，一瓶售价超过 3, 500 元，如今已经快跌破 2, 000 元，是巧合吗？过去一线城市房价和飞天茅台价格可以说是最硬的人民币计价资产了，甚至比现金还要优质。一线房产和飞天茅台在相当长的一段时间内有两个相同属性，一他们可以长期增值。二他们易于套现。然而现在情况出现了前所未有的变化，房价和飞天茅台两者双双在 2012 一年见顶。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2021',
              品牌: '保时捷',
              车型: null,
              区域: null,
              优惠金额: null,
              最低售价: null,
              裸车价: null,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: 'Macan',
              区域: '华南',
              优惠金额: 160000,
              最低售价: 448000,
              裸车价: null,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: 'Macan',
              区域: '山东',
              优惠金额: null,
              最低售价: null,
              裸车价: 500000,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: 'Macan',
              区域: '湖北',
              优惠金额: null,
              最低售价: null,
              裸车价: 500000,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: 'Macan',
              区域: '江西',
              优惠金额: null,
              最低售价: null,
              裸车价: 500000,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: 'Macan',
              区域: '福建',
              优惠金额: null,
              最低售价: null,
              裸车价: 500000,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: 'Macan',
              区域: '浙江',
              优惠金额: null,
              最低售价: null,
              裸车价: 500000,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: 'Macan',
              区域: '江苏',
              优惠金额: null,
              最低售价: null,
              裸车价: 500000,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: '泰肯',
              区域: null,
              优惠金额: null,
              最低售价: null,
              裸车价: 700000,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: null,
              区域: null,
              优惠金额: null,
              最低售价: null,
              裸车价: null,
              折扣: [70, 80]
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '品牌',
              description: '汽车品牌',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '车型',
              description: '具体车型',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '区域',
              description: '销售区域',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '优惠金额',
              description: '优惠金额',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '最低售价',
              description: '优惠后的最低售价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '裸车价',
              description: '裸车价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '折扣',
              description: '折扣比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '这不是巧合，其他很多数据也都在 2021 年见顶，比如另一个在 2021 年见顶并开始走下神坛的保时捷。保时捷销量的恶化还在加速，过去一年多，中国市场上保时捷的落地价可以说是惨不忍睹。近期，保时捷只卖 44 万的话题也引发了热议，其华南区域一家终端门店称， Macan 正在进行优惠促销，最高优惠 16 万，该车优惠后最低售价为 44.8 万。另外，在山东、湖北、江西、福建、浙江、江苏等多省份，该车均出现了 50 万元以下的裸车价，而报价达到 103.8 万的泰肯，现在 70 多万就可以拿下。目前，保时捷几乎所有的车型都可以打 7- 8 折。'
        }
      },
      {
        context: {
          dataTable: [
            {
              品牌: '保时捷',
              时间: '2024年一季度',
              销量: 16340,
              同比变化: -24
            },
            {
              品牌: '保时捷',
              时间: '2024年5月',
              销量: 4633,
              同比变化: -40.61
            }
          ],
          fieldInfo: [
            {
              fieldName: '品牌',
              description: '汽车品牌',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间',
              description: '具体时间',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '销量',
              description: '汽车销量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '同比变化',
              description: '与去年同期相比的变化',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '不只是保时捷，包括奔驰、宝马、奥迪在内的豪华汽车品牌今年以来都在大幅降价，但仍然止不住销量断崖式下降。 2024 年一季度，保时捷中国卖出 16, 340 辆，同比大幅下降24%。保时捷在今年 5 月份仅卖出 4, 633 辆，同比去年5月下滑高达40.61%。这说明保时捷在中国的销量正在加速减少。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2022',
              车型: '卡罗拉油电混动',
              国家: '中国',
              售价: 79800,
              指导价: 131800,
              售价对比: null
            },
            {
              年份: '2024',
              车型: '卡罗拉油电混动',
              国家: '美国',
              售价: 23500,
              指导价: null,
              售价对比: null
            },
            {
              年份: '2024',
              车型: '卡罗拉油电混动',
              国家: '中国',
              售价: null,
              指导价: null,
              售价对比: 50
            },
            {
              年份: '2022',
              车型: '凯美瑞混动版',
              国家: '中国',
              售价: 149800,
              指导价: null,
              售价对比: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '车型',
              description: '汽车的型号',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '汽车售价所在的国家',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '售价',
              description: '汽车的售价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '指导价',
              description: '汽车的原本指导价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '售价对比',
              description: '中国售价与美国售价的对比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '从两年前开始，特斯拉的 3 和 y 中国售价就是世界最低的， 7.98 万可以买到原本指导价 13.18 万的油电混动的卡罗拉。做一个对比，美国的油电混动卡罗拉的起售价是 2.35 万美元，有时甚至还要加价。按照美元人民币汇率计算，这款车的中国售价居然只有美国的一半水平，尽管配置存在差异，但不影响价格差异巨大的这个结论。除了卡罗拉外，汉兰达和凯美瑞也都大幅降价，即使是两年前，我们也很难想象只要 14.98 万人民币就可以买到最新款的混动版凯美瑞。'
        }
      },
      {
        context: {
          dataTable: [
            {
              时间: '十多年前',
              交通工具: '出租车',
              价格区间: [110, 120]
            },
            {
              时间: '现在',
              交通工具: '滴滴',
              价格区间: [60, 70]
            },
            {
              时间: '现在',
              交通工具: '出租车',
              价格区间: [110, 120]
            }
          ],
          fieldInfo: [
            {
              fieldName: '时间',
              description: '具体时间',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '交通工具',
              description: '使用的交通工具',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格区间',
              description: '单程价格区间',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国物价的下降不仅仅体现在商品上，服务价格也是类似的趋势。举个例子，十多年前我常驻北京，当时经常在晚上十一二点从首都机场打车到西直门这样一段单程大约需要 110- 120 元，而现在滴滴大概只要 60- 70 元。如果是现在的出租车，价格和十多年前还是一样的。'
        }
      },
      {
        context: {
          dataTable: [
            {
              银行: '工行',
              年份: '2022',
              不良率: 0.39
            },
            {
              银行: '工行',
              年份: '2023',
              不良率: 0.44
            },
            {
              银行: '农行',
              年份: '2022',
              不良率: 0.51
            },
            {
              银行: '农行',
              年份: '2023',
              不良率: 0.55
            },
            {
              银行: '建行',
              年份: '2022',
              不良率: 0.37
            },
            {
              银行: '建行',
              年份: '2023',
              不良率: 0.42
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
              fieldName: '年份',
              description: '数据对应年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '不良率',
              description: '个人住房贷款不良率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '以工行、农行、建行发布的数据来看，其 2023 年个人住房贷款不良率分别由 2022 年的0.39%、0.51%、 0.37% 增长至了0.44%、 0.55% 和0.42%，基本都实现了两位数的增幅。大家别觉得这些小数字没啥大不了的，要知道这三家银行每一家的个人住房贷款余额都超过了5万亿，而且按揭贷款往年基本上都是银行稳赚不赔的买卖。供建农三家银行之所以每年能够包揽中国最赚钱企业的前三名，按揭贷款所带来的收益贡献巨大。现在这个优质资产的不良率正在以每年两位数的增幅增加。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2022',
              季度: null,
              法拍房挂牌数量: 980000,
              同比增长率: null
            },
            {
              年份: '2023',
              季度: null,
              法拍房挂牌数量: 1410000,
              同比增长率: 43.9
            },
            {
              年份: '2024',
              季度: '一季度',
              法拍房挂牌数量: 604400,
              同比增长率: 192
            },
            {
              年份: '2024',
              季度: null,
              法拍房挂牌数量: 2000000,
              同比增长率: null
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
              fieldName: '季度',
              description: '数据对应的季度',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '法拍房挂牌数量',
              description: '法拍房挂牌的数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '同比增长率',
              description: '法拍房挂牌数量同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '你是银行，你慌不慌？而另一项作为佐证的数据则是法拍房，大家知道现在法拍房的数据有多夸张吗？根据瀚海研究院发布的数据显示， 2022 年全国共挂牌法拍房 98 万套，去年这个数字变成了 141 万套，增长了43.9%。而今年光是一季度的挂牌数量就已飙升至 60.44 万套通，同比上涨192%。这种局势下，银行要是再不改变断供处置策略，那今年的法拍数量估计有望达到 200 万。'
        }
      },
      {
        context: {
          dataTable: [
            {
              城市: '北京',
              年份: '2023',
              挂牌法拍房数量: 8153,
              成交法拍房数量: 2771,
              处置率: 33
            }
          ],
          fieldInfo: [
            {
              fieldName: '城市',
              description: '城市名称',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '挂牌法拍房数量',
              description: '挂牌法拍房的数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '成交法拍房数量',
              description: '最终成交的法拍房数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '处置率',
              description: '法拍房的处置率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '事实上，对银行来说，现在的行情即使他收了房也难以处置。我们以北京为例， 2023 年北京挂牌法拍房 8, 153 套，最终成交仅 2, 771 套，处置率为33%，这还是房价波动相对较小的北京，换到其他已经跌穿首付的地区，处置率恐怕只会更低。而在法拍流程里，流拍和拍品二次上拍都会在此前的价格上更进一步降低，这也导致了银行回款难度的进一步提高。虽然按照现在的规则，这部分差价是由贷款人承担的，但对方既然已经到了选择断供的地步，可想而知最终也执行不了多少。'
        }
      },
      {
        context: {
          dataTable: [
            {
              日期: '2024-04-30',
              未出售商品房面积: 746000000,
              正常库存水平: 590000000,
              统计时间: '2024-05',
              城市数量: 222,
              宽松政策数量: 341
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
              fieldName: '未出售商品房面积',
              description: '未出售商品房的总面积',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '正常库存水平',
              description: '正常库存水平的面积',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '统计时间',
              description: '统计数据的时间',
              fieldType: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '城市数量',
              description: '全国出台宽松政策的城市数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '宽松政策数量',
              description: '全国出台的宽松政策数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '另一项推动银行改变策略的原因，则是今年4月 30 号的一场会议，这场会议确定了房地产行业未来一年的发展方向，统筹消化存量房产和优化增量住房，用大家都熟悉的话来说就是去库存。根据国家统计局的官方数据显示，截至 2024 年5月，我国未出售商品房为 7.46 亿平米，远超 5.9 亿平米的正常库存水平。而整个上半年，根据 CRS 的统计，全国 222 个城市总计出台了 341 项宽松政策，但带来的效果均不理想，无论是销售面积还是投资金额，仍然在持续走低。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2023',
              汽车出口量: 4910000
            },
            {
              年份: '2021',
              汽车出口量: 2020000
            },
            {
              年份: '2022',
              汽车出口量: 3110000
            },
            {
              年份: '2023',
              汽车出口量: 4910000
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
              fieldName: '汽车出口量',
              description: '汽车出口的数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '大家好，我拍拍一名做过财经记者，大学老师和滴滴司届 up 主。 2023 年，我国汽车出口量达到了 491 万辆，超越日本成为世界第一汽车出口国。要知道，日本在这个位置坐了 8 年之久，而中国仅在过去三年时间里接连赶超韩国、德国、日本。中国汽车出口， 2021 年 202 万辆， 2022 年 311 万辆， 2023 年 491 万辆。'
        }
      },
      {
        context: {
          dataTable: [
            {
              车型: '名爵ZS',
              品牌: '名爵',
              指导价: [80000, 90000]
            },
            {
              车型: '特斯拉 model y',
              品牌: '特斯拉',
              指导价: null
            },
            {
              车型: '奇瑞瑞虎7',
              品牌: '奇瑞',
              指导价: null
            },
            {
              车型: '特斯拉 model 3',
              品牌: '特斯拉',
              指导价: null
            },
            {
              车型: '名爵 4 EV',
              品牌: '名爵',
              指导价: null
            },
            {
              车型: '奇瑞虎5X',
              品牌: '奇瑞',
              指导价: null
            },
            {
              车型: '欧盟达名爵5',
              品牌: '名爵',
              指导价: null
            },
            {
              车型: '缤越',
              品牌: '缤越',
              指导价: 60000
            }
          ],
          fieldInfo: [
            {
              fieldName: '车型',
              description: '中国出口的乘用车车型',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '品牌',
              description: '汽车品牌',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '指导价',
              description: '汽车国内指导价',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国汽车转眼间为何变得这么受欢迎呢？又到底是哪些国家在购买中国汽车？中国卖给老外汽车又是些什么品牌和价位车型？本期视频就为大家打开中国汽车出口全球第一背后的真实数据。首先，中国出口的 491 万辆汽车都是些什么车呢？根据乘联会统计，中国乘用车出口量前十车型分别为名爵ZS、特斯拉 model y、奇瑞瑞虎7、特斯拉 model 3、名爵 4 EV、奇瑞虎5X、欧盟达名爵5、缤越元plus。除了特斯拉的 model y 和 model 3，其他车型国内指导价基本都在 10 万元左右，比如排名第一的名爵ZS，指导价 8- 9万元，最便宜的名爵 5 和缤越低到6万元就能拿下，可见中国汽车出海主打的还是一个性价比。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2013',
              汽车类型: '燃油车',
              出口数量: 3710000,
              新能源车出口占比: null,
              新能源车出口增速: null
            },
            {
              年份: '2013',
              汽车类型: '新能源汽车',
              出口数量: 1200000,
              新能源车出口占比: 25,
              新能源车出口增速: null
            },
            {
              年份: '2023',
              汽车类型: '新能源汽车',
              出口数量: null,
              新能源车出口占比: null,
              新能源车出口增速: 77.6
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
              fieldName: '汽车类型',
              description: '燃油车或新能源汽车',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '出口数量',
              description: '汽车出口数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源车出口占比',
              description: '新能源汽车占出口总量的比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源车出口增速',
              description: '新能源汽车出口的增长速度',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '如果按燃油车、新能源车的分类来看， 2013 年中国出口燃油车 371 万辆，出口新能源汽车 120 万辆，新能源车占到出口总量的25%，虽然这个占比目前只有 1/ 4，但去年新能源出口增速是77.6%，势头不可谓不猛。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2013',
              国家: '俄罗斯',
              出口量: 909000
            },
            {
              年份: '2013',
              国家: '墨西哥',
              出口量: 415000
            },
            {
              年份: '2013',
              国家: '比利时',
              出口量: 217000
            },
            {
              年份: '2013',
              国家: '澳大利亚',
              出口量: 214000
            },
            {
              年份: '2013',
              国家: '英国',
              出口量: 214000
            },
            {
              年份: '2013',
              国家: '沙特阿拉伯',
              出口量: 213000
            },
            {
              年份: '2013',
              国家: '菲律宾',
              出口量: 172000
            },
            {
              年份: '2013',
              国家: '泰国',
              出口量: 169000
            },
            {
              年份: '2013',
              国家: '阿联酋',
              出口量: 159000
            },
            {
              年份: '2013',
              国家: '西班牙',
              出口量: 139000
            },
            {
              年份: '2013',
              地区: '欧洲',
              占比: 38
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
              fieldName: '国家',
              description: '汽车出口的国家',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '出口量',
              description: '汽车出口量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '地区',
              description: '按地区划分的市场',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '占比',
              description: '地区占中国汽车对外出口的比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '那中国汽车出口都卖到了哪些国家呢？ 2013 年中国汽车出口量前十的国家分别是，俄罗斯90.9万辆，墨西哥 41.5 万辆，比利时 21.7 万辆，澳大利亚 21.4 万辆，英国 21.4 万辆，沙特阿拉伯 21.3 万辆，菲律宾 17.2 万辆，泰国 16.9 万辆，阿联酋 15.9 万辆，西班牙 13.9 万辆。按地区来看的话，欧洲市场占中国汽车对外出口的38%，远超其他任何单一大洲，可见中国汽车正在得到全世界更多人的认可。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2023',
              国家: '俄罗斯',
              汽车出口量: 909000,
              出口量增长率: 468,
              市场占有率: 51,
              贡献率: 42,
              预测市场占有率: null
            },
            {
              年份: '2024',
              国家: '俄罗斯',
              汽车出口量: null,
              出口量增长率: null,
              市场占有率: null,
              贡献率: null,
              预测市场占有率: 80
            },
            {
              年份: '2023',
              国家: '俄罗斯',
              汽车出口量: null,
              出口量增长率: null,
              市场占有率: 11.2,
              贡献率: null,
              预测市场占有率: null
            },
            {
              年份: '2023',
              国家: '俄罗斯',
              汽车出口量: null,
              出口量增长率: null,
              市场占有率: 10.6,
              贡献率: null,
              预测市场占有率: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应的年份',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '国家名称',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '汽车出口量',
              description: '中国对该国的汽车出口量',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口量增长率',
              description: '汽车出口量的增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场占有率',
              description: '中国品牌在该国新车市场的占有率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '贡献率',
              description: '该国对中国汽车出口增量的贡献率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '预测市场占有率',
              description: '预测的中国汽车在该国新车市场的占有率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然了，中国汽车出口世界第一，又不得不提议俄罗斯和墨西哥这两个国家可以说去年是把中国车买爆了。 203 年，中国对俄罗斯的汽车出口量从上一年度的 16 万辆暴增到了90.9万辆，增加了468%。在俄罗斯的新车市场中，第一名是俄罗斯品牌拉达，第二至第七名则全都是中国品牌，比如第二名是奇瑞金车，市场占有率11.2%。第三名是哈弗，新车，市场占有率10.6%。俄罗斯卖最好的新能源车也是来自中国的极客。目前中国汽车已经占据俄罗斯新车市场的51%，可以说是拿下了半壁江山。而对于中国而言，仅俄罗斯一个国家 203 年就贡献了中国汽车出口增量的42%，甚至有俄罗斯本土汽车经销商预测， 2024 年中国汽车可能占据俄罗斯新车份额的80%。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2013',
              国家: '欧洲',
              市场份额: 18
            },
            {
              年份: '2013',
              国家: '欧洲',
              市场份额: 4
            },
            {
              年份: '2013',
              国家: '韩国',
              市场份额: 16
            },
            {
              年份: '2013',
              国家: '韩国',
              市场份额: 6
            },
            {
              年份: '2013',
              国家: '日本',
              市场份额: 12
            },
            {
              年份: '2013',
              国家: '日本',
              市场份额: 5
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
              fieldName: '国家',
              description: '国家名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额',
              description: '市场份额占比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '有人说俄罗斯满爆中国汽车是因为欧美的贸易封锁，这也步无道理。 2013 年在俄罗斯的新车市场中，欧洲的市场份额从 18% 降到了4%，韩国从 16% 降到了6%，日本从 12% 降到了5%，和欧日韩都是对俄罗斯实行了限制出口国家，其中就包括了部分汽车，可以说中国汽车吃下的正是欧日韩在俄罗斯丢掉市场。'
        }
      },
      {
        context: {
          dataTable: [
            {
              国家: '墨西哥',
              年份: '2013',
              中国汽车占比: 25,
              汽车品牌: null,
              销量: null,
              新能源汽车占比: null
            },
            {
              国家: '墨西哥',
              年份: '2007',
              中国汽车占比: 0,
              汽车品牌: null,
              销量: null,
              新能源汽车占比: null
            },
            {
              国家: '澳大利亚',
              年份: '2023',
              中国汽车占比: null,
              汽车品牌: '名爵',
              销量: 58000,
              新能源汽车占比: null
            },
            {
              国家: '澳大利亚',
              年份: '2023',
              中国汽车占比: null,
              汽车品牌: '比亚迪',
              销量: null,
              新能源汽车占比: 14
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
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '中国汽车占比',
              description: '中国汽车在该国销售汽车中的占比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '汽车品牌',
              description: '汽车品牌名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '销量',
              description: '汽车销量',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源汽车占比',
              description: '中国新能源汽车在该国市场的占比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然了，除了俄罗斯之外，其他国家也在买中国汽车，比如墨西哥。 2013 年，墨西哥所有销售汽车中有 25% 来自中国，而在 6 年前这个数字为0。澳大利亚也在不断买中国汽车，最受澳大利亚欢迎的中国汽车品牌是名爵，去年卖了 5.8 万辆。在新能源车市场，比亚迪则占据了澳大利亚的新能源汽车 14% 份额，位于第二名。'
        }
      },
      {
        context: {
          dataTable: [
            {
              公司: '特斯拉',
              市场: '市场',
              年份: null,
              市场份额: 53,
              销量: null,
              出口国家和地区数量: null,
              平均出口价格: null
            },
            {
              公司: '中国车企',
              市场: '东南亚',
              年份: 2013,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              平均出口价格: null
            },
            {
              公司: '中国品牌',
              市场: '泰国',
              年份: null,
              市场份额: 80,
              销量: null,
              出口国家和地区数量: null,
              平均出口价格: null
            },
            {
              公司: '比亚迪',
              市场: '泰国',
              年份: null,
              市场份额: 40,
              销量: null,
              出口国家和地区数量: null,
              平均出口价格: null
            },
            {
              公司: '比亚迪',
              市场: '全球',
              年份: 2023,
              市场份额: null,
              销量: 240000,
              出口国家和地区数量: 58,
              平均出口价格: null
            },
            {
              公司: '中国新能源汽车',
              市场: '全球',
              年份: 2019,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              平均出口价格: 5000
            },
            {
              公司: '中国新能源汽车',
              市场: '全球',
              年份: 2022,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              平均出口价格: 22000
            },
            {
              公司: '比亚迪',
              市场: '欧洲',
              年份: null,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              平均出口价格: 500000
            }
          ],
          fieldInfo: [
            {
              fieldName: '公司',
              description: '公司名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场',
              description: '市场名称',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额',
              description: '市场份额占比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '销量',
              description: '销量数据',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口国家和地区数量',
              description: '出口的国家和地区数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '平均出口价格',
              description: '新能源汽车平均出口价格',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然，这里也不得不提一下第一名，那就是特斯拉市场份额高达53%，在东南亚市场，中国车企业销量在 2013 年同样实现小幅上升，最典型的就是泰国，在泰国的新能源车市场，中国品牌占据了 80% 的份额，比如比亚迪的原 plus 就是泰国的新能源车爆款，那到底是什么原因让中国汽车爆卖呢？基本还可以总结为三方面原因，首先是全球疫情爆发，由于中国汽车的供应链完善，疫情期间仍能维持稳定生产，而日韩这些过去的出口大户受疫情影响，芯片、钢材、橡胶等关键原材料短缺，不仅汽车产能下降，而且成本升高，这就让中国汽车更具性价比。而随着中国国内新能源汽车市场越来越卷出海，成为不少中国车企的选择，比如比亚迪 2023 年进入全球 58 个国家和地区，出口汽车 24 万辆，是上一年度的 3.34 倍。在泰国新能源车市场，比亚迪单独占到了 40% 的市场份额，是名副其实的泰国新能源汽车销冠。而且中国新能源汽车并非只是具备成本优势，汽车与 AI 互联网融合的智能化更是中国车企的拿手好戏。从豪华配置到智能大屏，从外观设计到内饰比拼，这让中国新能源汽车的溢价能力明显变高。2019 年中国新能源汽车平均出口价格每量只有 5, 000 美元， 2022 年涨到了 2.2 万美元。比如比亚迪汉在欧洲发布时价格接近 50 万人民币，是国内售价的两倍多。在泰国、以色列、新西兰等多个国家，比亚迪也已经是新能源汽车的销售冠军。不过，中国汽车征服海外虽然是一部励志爽门，但其实有不少挑战。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2000',
              国家: '越南',
              摩托车品牌: '中国摩托车',
              市场份额: 80
            },
            {
              年份: '2024',
              国家: '越南',
              摩托车品牌: '日本摩托车',
              市场份额: 95
            },
            {
              年份: '2024',
              国家: '越南',
              摩托车品牌: '中国摩托车',
              市场份额: 1
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '市场所在国家',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '摩托车品牌',
              description: '摩托车品牌',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额',
              description: '摩托车品牌在市场中的占比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '其实中国汽车出海不禁让人想起曾经的中国摩托车出海。 2000 年前后，中国摩托车进军越南，一度占据了 80% 的越南市场份额，但不到三四年时间，却被日本摩托车打得片甲不留。如今日本摩托车在越南占据 95% 的份额，而中国摩托车百分之一都不到。曾经也有大量中国摩托车车企在越南建厂，但却形成了恶性竞争的关系，疯狂打价格战，导致服务和质量越来越差，越南的中国摩托车车企仿佛是飘在越南的。'
        }
      },
      {
        context: {
          dataTable: [
            {
              企业类型: '规模以上制造企业',
              企业数量: 445000,
              企业规模: '年销售收入2000万以上'
            },
            {
              企业类型: '制造业企业',
              企业数量: 6220000,
              企业规模: '存续'
            },
            {
              企业类型: '规模以下中小微工厂',
              企业数量: 4000000,
              企业规模: '中小微'
            },
            {
              企业类型: '工厂',
              企业数量: null,
              企业规模: '规模不到50人',
              员工人数占比: 40
            },
            {
              企业类型: '工厂',
              企业数量: null,
              企业规模: '规模不到500人',
              员工人数占比: 90
            },
            {
              企业类型: '工厂',
              企业数量: null,
              企业规模: '大部分',
              年产值范围: [1000000, 10000000]
            }
          ],
          fieldInfo: [
            {
              fieldName: '企业类型',
              description: '企业的类型',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '企业数量',
              description: '企业的数量',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '企业规模',
              description: '企业的规模',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '员工人数占比',
              description: '工厂员工人数占比',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '年产值范围',
              description: '工厂的年产值范围',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '每个中国制造品牌的背后都有一批优秀的零部件供应商，像汇川技术、恒力液压、先导智能、顺域光学、军胜电子这样的零部件企业也是中国制造的骄傲，只不过知名度无法媲美消费者直接接触的终端品牌。按照官方的口径，中国规模以上也就是年销售收入 2, 000 万以上的制造企业有 44.5 万家。至于中国一共有多少家制造业企业存在各种口径，从 300 多万家到近千万家不等。万德资讯给我的数据是，中国大约有 622 万家存续的制造业企业。海之在线是一家总部在上海，聚焦中间品贸易的数字化平台，连接着 70 万家工厂，他们给我的数据是，中国规模以下的中小微工厂大致有 400 万家。这期节目标题中的 400 万家沉默工厂处处记载于此。海志在线的创始人、 CEO 佘莹对我说，从平台看， 40% 的工厂规模不到 50 人，近 90% 的工厂不到 500 人，大部分工厂的年产值在数百万元到数千万元。如果和大企业比，你可以说他们就是一个个的小做法。如果走进去可能会看到老旧的机器上油漆斑驳，可以看到生产计划就用记号笔写在车间墙上挂着的白板上，甚至会发现用破洞的木板随意围搭起来的厕所，待客的茶水里则混杂着浓浓的机油味。但他们就是中国制造业毛细血管层面的供应链小节点，勤勤恳恳的维护设备、搞生产，他们最在意的是生存，是接到订单以及在满足客户之后能够完整的收到货款。'
        }
      },
      {
        context: {
          dataTable: [
            {
              年份: '2024',
              金属类型: '铝和其他废金属',
              产量变化: 20
            },
            {
              年份: '2024',
              金属类型: '钢铁',
              产量变化: [-10, -5]
            },
            {
              月份: '5月',
              指标: '开发商的银行贷款',
              变化比例: 19
            },
            {
              月份: '5月',
              指标: '房贷和存款跟预付款的比例',
              变化比例: [-40, -30]
            },
            {
              预测年份: '2024',
              贷款增加: 4500000000000
            },
            {
              预测年份: '2025',
              贷款增加: 4500000000000
            },
            {
              预测年份: '2026',
              贷款增加: 4500000000000
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应时间',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '金属类型',
              description: '金属的种类',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '产量变化',
              description: '金属产量的变化比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '月份',
              description: '具体月份',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '指标',
              description: '具体指标',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '变化比例',
              description: '同比变化比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '预测年份',
              description: '预测的年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '贷款增加',
              description: '房地产贷款增加的金额',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '有报道称，一些地方政府面临收入短缺，要求企业缴纳可追溯到 1990 年代的税单。这种紧缩政策在房地产市场寻找几步的时刻，会损害上信心和经济。高盛认为，中国中央政府可以通过加大对西方政府的财政支持来切断机房政府无紧缩所出现的负面溢出效应，那如同美国监管机构在次贷危机期间通过成为最后贷款人来切断金融危机的传播一样。关于出口和机产之间的分化，可以同中国的金属生产中得到证实啊。铝和其他废且金属的产量相比疫情之前上升了 20% 以上，而钢铁的产量下降了 5% 到10%。在房产方面，开发商越来越依赖银行融资， 5 月份对开发商的银行贷款同比增长了19%。而随着房地产销售的下滑，房贷和存款跟预付款的比例同比下降了 30% 到40%。高盛银行股票团队预计从 2024 年到 2026 年，房地产贷款将增加 4.5 万亿人民币，以完全期待收缩的房地产债券和设防的影子银行贷款。'
        }
      },
      {
        context: {
          dataTable: [
            {
              投资类型: '燃气和水的生产投资',
              增长率: 100
            },
            {
              投资类型: '整体基建投资',
              增长率: null
            },
            {
              销售类型: '代线销售商品',
              月份: '5月',
              同比增长率: 13
            },
            {
              销售类型: '餐饮销售',
              月份: '5月',
              同比增长率: 5
            },
            {
              销售类型: '线下商品销售',
              月份: '5月',
              同比增长率: 0
            }
          ],
          fieldInfo: [
            {
              fieldName: '投资类型',
              description: '具体的投资类型',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '增长率',
              description: '投资增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '销售类型',
              description: '具体的销售类型',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '月份',
              description: '具体月份',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '同比增长率',
              description: '销售同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国经济分化并不止于出口和房地产基础设施的固定资产投资。细分项显示，建立燃气和水的生产投资已同疫情前水平翻倍，远远超过了整体的基建的投资增长。因为中国政府首先优先考虑农源供用安全和脱碳。在零售销售当中， 5 月份代线销售商品同比增长13%，而餐饮销售仅增长5%，线下商品的销售保持在去年同期的水平。'
        }
      },
      {
        context: {
          dataTable: [
            {
              季度: '一季度',
              同比增长率: 5.3,
              增长预测: null
            },
            {
              季度: 'G2季度',
              同比增长率: null,
              增长预测: 5
            }
          ],
          fieldInfo: [
            {
              fieldName: '季度',
              description: '具体季度',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '同比增长率',
              description: '同比增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '增长预测',
              description: '增长预测',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '7月中旬将举行两场重要的政策会议，前者将专注于评估当前的经济状况，并为今年剩余时间制定周期性的政策安排。后者将专注于至少未来五年解决经济结构当中的重大改革议程。鉴于一季度的实际， g GPT 同比增长5.3%，而且去年基数较低，那么 G2 季度增长可能高于5%，政府的全年增长目标仍然在轨道上。'
        }
      },
      {
        context: {
          dataTable: [
            {
              月份: '7月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: null
            },
            {
              月份: '5月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: null
            },
            {
              月份: null,
              季度: '三季度',
              降息幅度: 25,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: null
            },
            {
              月份: '9月',
              季度: '四季度',
              降息幅度: 10,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: null
            },
            {
              月份: '3月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: 11.9,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: 2024
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: 11.2,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: 2023
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: 9,
              美元兑人民币汇率: null,
              年份: 2024
            },
            {
              月份: '4月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: null
            },
            {
              月份: '6月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: null
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: 7.3,
              年份: null
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null,
              年份: '2018-2019'
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
              fieldName: '季度',
              description: '具体季度',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '降息幅度',
              description: '降息的基点数',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '财政赤字占GDP比例',
              description: '财政赤字占GDP的比例',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '信贷增长率',
              description: '信贷增长率',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '美元兑人民币汇率',
              description: '美元兑人民币汇率',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '年份',
              description: '具体年份',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '高盛认为，政策执行者不会在 7 月份的首场会议上释放任何重大的刺激措施，宏观政策的证件可能大于维持当前立场和执行现有的政策。另一方面，鉴于 5 月份宣布的最后一批措施不及预期，可能存在引入更多期产宽松政策的可能性。在货币政策方面，资本外流的担忧和银行利润率的下降限制了央行降息的能力。高盛预计三季度将降息 25 个基减，以适应大量政府债券发行，并预计季四季度9月首次降息后会再降息 10 个期减。在财政政策方面，高盛预计政府债券的发行将在下半年显著增加，以完成年初发行缓慢的全年配额。除非增长急剧放缓，否则基建的投资不会加速太多。对于政府 3 月份公布的预算计划，高盛虽然预测中国的增强型的弹盛赤字从去年的 gdp 11.2% 会适度扩大到今年的11.9%，但由于今年出口强计可能会存在财政扩张不及预期的风险。信贷政策方面，正如央行行长6月 19 号陆家嘴论坛上所说，由于金融套利的虚假贷款和监管机构随后对金融系统中这种资金空转的打击，信贷增长与 GDP 增长之间的联系已经减弱。预计摄容总量的增长将同去年的 9.5% 放缓到今年的9%。在住房政策方面，4月的政治局会议表明，决策者希望严防房地产市场的尾部风险。由于地产价格和活动的持续下行，以及机房国企通过央行的贷款计划购买空池公寓的速度缓慢，高盛预计进一步削减房贷利率以刺激需求，同时为去库存提供更多的资金和效率的支持。在外汇政策方面，鉴于美元持续强势和资本外流的压力，高盛认为央行将在短期内保持美元对人民币汇率的稳定，三个月的高盛预测是7.3，因为外汇市决策者可以迎来抵消关税对出口负面影响的工具。 2018- 19 年的经验表明，如果特朗普赢得美国大选，而且正如他最近几个月所宣称的，会对中国实施正大的关税，那美元兑人民币可能会显著贬值。'
        }
      },
      {
        context: {
          dataTable: [
            {
              country: 'Japan',
              energy_import_ratio: 90,
              food_import_ratio: 60,
              inflation_status: 'returned'
            }
          ],
          fieldInfo: [
            {
              fieldName: 'country',
              description: 'The name of the country',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'energy_import_ratio',
              description: 'The percentage of energy imported',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'food_import_ratio',
              description: 'The percentage of food imported',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'inflation_status',
              description: 'Indicates whether inflation has returned',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: 'Because Japan is one of the most import dependent countries in the world, importing over 90% of its energy and over 60% of its food, a weak yen means inflation has returned to Japan for the first time in decades. '
        },
        timeCost: '4.9'
      },
      {
        context: {
          dataTable: [
            {
              period: '1955-1990',
              average_growth_rate: 6.8,
              GDP_multiplier: 8,
              lowest_growth_rate: 3,
              lowest_growth_year: 1974
            }
          ],
          fieldInfo: [
            {
              fieldName: 'period',
              description: 'Time period of economic growth',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'average_growth_rate',
              description: 'Average annual growth rate',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'GDP_multiplier',
              description: 'Multiplier of GDP over the period',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'lowest_growth_rate',
              description: 'Lowest annual growth rate during the period',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'lowest_growth_year',
              description: 'Year of the lowest growth rate',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: ' For context, in the post war years, Japan experienced many decades of rapid economic growth in a period dubbed the Japanese Miracle. From 1955 to 1990, Japanese growth averaged 6.8% per year, and GDP multiplied eight times, with growth falling below 3% only once during the 1974 oil shock.'
        },
        timeCost: '2.8'
      },
      {
        context: {
          dataTable: [
            {
              period: '80s',
              event: 'Rapid appreciation in Japanese stock and real estate prices',
              residential_house_price_change: null,
              commercial_property_price_change: null,
              stock_index_change: null
            },
            {
              period: '1990',
              event: 'Bubble burst',
              residential_house_price_change: null,
              commercial_property_price_change: null,
              stock_index_change: null
            },
            {
              period: 'Decade after 1990',
              event: 'Residential house prices fell',
              residential_house_price_change: -50,
              commercial_property_price_change: -85,
              stock_index_change: -75
            },
            {
              period: 'Until very recently',
              event: 'Growth and inflation remained close to zero',
              residential_house_price_change: null,
              commercial_property_price_change: null,
              stock_index_change: null
            }
          ],
          fieldInfo: [
            {
              fieldName: 'period',
              description: 'The time period of the event',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'event',
              description: 'Description of the event',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'residential_house_price_change',
              description: 'Change in residential house prices',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'commercial_property_price_change',
              description: 'Change in commercial property prices',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'stock_index_change',
              description: "Change in Japan's main stock index",
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Anyway, this anxiety subsided in the 90s when Japan experienced an enormous financial crisis after a rapid appreciation in Japanese stock and real estate prices during the 80s. In 1990, the bubble burst and continue to burst for a while. In the decade after 1990, residential house prices fell by more than 50%, commercial property prices fell by something like 85%. And Japan's main stock index, the Nike 2,2,5 fell by about 75%. Japan's economy never really recovered and growth and inflation both remained close to zero until very recently."
        },
        timeCost: '8.4'
      },
      {
        context: {
          dataTable: [
            {
              date: 'last year',
              yen_to_dollar: 130
            },
            {
              date: 'Monday',
              yen_to_dollar: 160
            },
            {
              date: 'Tuesday morning',
              yen_to_dollar: 155
            }
          ],
          fieldInfo: [
            {
              fieldName: 'date',
              description: 'Specific date or time period',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'yen_to_dollar',
              description: 'Exchange rate of yen to dollar',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "From 2016 until late last year. The Bank of Japan even began what's called yield curve control, which essentially involved buying up enough debt to guarantee that government borrowing costs wouldn't go above a certain level. Japan's ultra loose monetary policy came under pressure in 2022 when inflation started rising across the world. Usually, central banks raise interest rates, but the bank of Japan decided not to, both because inflation was relatively low in Japan, but also because thanks to its enormous debt burden, even a slight raise in interest rates would translate to a massive increase in debt servicing costs, especially for the Japanese government. Unfortunately, things have become more difficult as other central banks have raised rates, making their currencies relatively more attractive and sparking a decline in the yen. In the last year, the yen has fallen from about 130 to the dollar to a 34 year low of 160 to the dollar on Monday. Now the speed and severity of this decline presents a difficult dilemma for the bank of Japan because thanks to Japan's reliance on imports, it sparked significant inflation in essential items like food and energy. But they still don't want to raise rates for the reasons we've just mentioned earlier. This is why on Monday evening, instead of raising rates, the bank of Japan used billions of dollars worth of Japan's foreign exchange reserves to buy up the yen on the international market, artificially inflating its value. While this seems to have worked in the short term, as of Tuesday morning, the yen is now trading at nearer 155 to the dollar. It's both expensive and fundamentally unsustainable. Even if the bank of Japan has some of the largest foreign exchange reserves in the world. All in all, assuming the bank of Japan won't engage in significant rate hikes, this means that the yen is very much dependent on what goes on in the rest of the world. If inflation comes down and other central banks start cutting rates, then this will reduce some of the pressure on the yen. But if inflation turns out to be stickier than we'd like, which seems to be the case, then the divergence between the bank of Japan and other central banks will persist, which means more downward pressure on the yen. If this happens, then the bank of Japan won't be able to stave off the yen's decline with exchange reserves forever. And eventually, they'll have to choose a horn of their uncomfortable dilemma, either to just accept the yen's decline and all the inflation related political turmoil that comes with it all, raise rates and just hope that the world's most debt burdened economy can somehow deal with it."
        },
        timeCost: '2.8'
      },
      {
        context: {
          dataTable: [
            {
              company: 'Linkage',
              valuation: null,
              market_share: null,
              industry_value: null,
              acquisition_year: null,
              revenue: 2300,
              revenue_growth: null,
              expected_break_even: null
            },
            {
              company: 'Zomato',
              valuation: 13,
              market_share: 46,
              industry_value: 23000,
              acquisition_year: 2022,
              revenue: 23,
              revenue_growth: 3,
              expected_break_even: '2025-Q1'
            }
          ],
          fieldInfo: [
            {
              fieldName: 'company',
              description: 'Name of the company',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'valuation',
              description: 'Valuation of the company in million dollars',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'market_share',
              description: 'Market share percentage',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'industry_value',
              description: 'Value of the quick commerce industry in crores',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'acquisition_year',
              description: 'Year of acquisition',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'revenue',
              description: 'Revenue of the company in crores',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'revenue_growth',
              description: 'Revenue growth factor',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'expected_break_even',
              description: 'Expected break-even year and quarter',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: "Blanket is all over the news. Linkage is now more valuable than Zomato. Linkage reported over 2,300 for rupees and revenue. And then now speak about Zomato, they speak about blinking bigger than tomato right now with the valuation of roughly $13 million and a market share of 46%, it has disrupted India's 23,000 crore quick commerce industry, a company that Zomato acquired in 2022 to enter into quick commerce, but now has become more valuable, the Zomato's own food delivery business. In fact, the company 3 x its revenue from 800 crores to 23 crores and is expected to break even in the first quarter of Fi 2025."
        },
        timeCost: '9.8'
      },
      {
        context: {
          dataTable: [
            {
              average_order_value: 600,
              revenue_source: 'suppliers',
              percentage_revenue: [11, 13],
              revenue_amount: 72
            }
          ],
          fieldInfo: [
            {
              fieldName: 'average_order_value',
              description: 'The average value of an order',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'revenue_source',
              description: 'The source of revenue',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'percentage_revenue',
              description: 'The percentage of revenue from the source',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'revenue_amount',
              description: 'The amount of revenue from the source',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "By the way, this is going to be detailed, so feel free to pause the video wherever you feel confused. First of all, let's take a realistic average order value of 600 rupees, which is very close to what most people usually order on blink it. If you look at the revenue side, which is the money that bind it earns here for themselves from each order is divided into three sources. The first one is warehousing services and marketplace commissions. This is basically the amount that suppliers are paying to blanket for showing and selling their products. And see on every order of 600 rupees, 11 to 13% is coming from suppliers, which is roughly 72 rupees."
        },
        timeCost: '4.8'
      },
      {
        context: {
          dataTable: [
            {
              company: 'brew',
              keyword: 'coffee',
              ad_rate: 3.5,
              cost: 21
            }
          ],
          fieldInfo: [
            {
              fieldName: 'company',
              description: 'Name of the company',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'keyword',
              description: 'Search keyword',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'ad_rate',
              description: 'Advertisement rate as a percentage',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'cost',
              description: 'Cost in rupees',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Now the second part of the income of this order is the ads that come companies show on blanket. This is the price that brands pay to show their products above other products as you scroll the app. For example, brew might pay to show its coffee first when someone searches for a keyword like coffee, it's roughly 2.3 to 3.5%. In our case, let's take 3.5% and it will come down to 21 rupees."
        },
        timeCost: '3.9'
      },
      {
        context: {
          dataTable: [
            {
              fee_type: 'customer fees',
              average_order_value: 600,
              fee_amount: 18,
              take_rate: 110
            }
          ],
          fieldInfo: [
            {
              fieldName: 'fee_type',
              description: 'Type of fee',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'average_order_value',
              description: 'Average value of an order',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'fee_amount',
              description: 'Amount of fee',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'take_rate',
              description: 'The share that blanket keeps for itself from an order',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "The next is customer fees, which includes your delivery fees, handling fees for packaging and delivering the food to your doorstep, and even additional fees like fees they charge you for having a small cut. This percentage comes at around three portion of the average order value and is roughly 18 rupees in our case. By the way, there are also other levers like membership plans or free delivery plans that these plan platforms try to sell you often like Zepto does it with their offering of zeptopass. But if we don't over complicate and dive much deeper into this, we see that in a nutshell, on an average order of 600 rupees, blanket owns roughly 110 rupees. This 110 rupees is known as a take rate, the share that blanket keeps for itself from an order."
        },
        timeCost: '3.8'
      },
      {
        context: {
          dataTable: [
            {
              cost_element: 'last mile delivery cost',
              percentage_cost: 7,
              cost_in_rupees: 42
            },
            {
              cost_element: 'dark store mid mile and warehousing cost',
              percentage_cost: 6.5,
              cost_in_rupees: 39
            },
            {
              cost_element: 'other variable cost',
              percentage_cost: 2,
              cost_in_rupees: 12
            },
            {
              cost_element: 'customer acquisition cost',
              percentage_cost: [0.2, 0.3],
              cost_in_rupees: 1.8
            }
          ],
          fieldInfo: [
            {
              fieldName: 'cost_element',
              description: 'Different elements of cost',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'percentage_cost',
              description: 'Cost as a percentage of total',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'cost_in_rupees',
              description: 'Cost in rupees',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Now let's come down to the cost side. Even here you have four elements. The first one is the biggest one, which is the last mile delivery cost, which is the last step when the riders deliver the orders to you and cost about roughly 7% to blanket. And in our case, it would come down to 42 rupees. The next one is dark store mid mile and warehousing cost. This entire combination of cost comes down to about 6.5%. And in our case, it would be 39 rupees. The other variable cost, which includes packaging, washes, support, communication and payment charges are roughly 2%, which comes down to 12 rupees. And now the fourth and the last one is customer acquisition cost, which is the discount, the incentives and the offers they try to give you to make tempting these for you. This comes at about 0.2 to 0.3% at about 1.8 rupees. So if you subtract these two amounts, blink it on roughly 15 rupees from entire transaction. This 15 rupees is not the net profit, by the way, but the contributing profit. Now what is that? See, contributing profit is the profit that the company is earning by serving each order. And company considers only the variable expenses in this case, which is the expense that we have already discussed. And it does not mean net profit because there are so many fixed expenses that are not considered like expensive salary of tech folks, rent, insurance, depreciation, and all similar big sums of money."
        },
        timeCost: '7.3'
      },
      {
        context: {
          dataTable: [
            {
              store_type: 'dark store',
              store_size: [2500, 4000],
              radius: [1.5, 3],
              SKUs: 6000,
              GMV_per_square_foot: 90000,
              mother_warehouse_size: [20000, 175000],
              staff_count: [25, 30],
              operating_cost_per_order: 22
            },
            {
              store_type: 'Dmart',
              GMV_per_square_foot: 47000
            }
          ],
          fieldInfo: [
            {
              fieldName: 'store_type',
              description: 'Type of store',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'store_size',
              description: 'Size of the store in square feet',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'radius',
              description: 'Radius in kilometers',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'SKUs',
              description: 'Number of Stock Keeping Units',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'GMV_per_square_foot',
              description: 'Gross Merchandise Value per square foot in rupees',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'mother_warehouse_size',
              description: 'Size of the mother warehouse in square feet',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'staff_count',
              description: 'Number of staff working in dark stores',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'operating_cost_per_order',
              description: 'Operating cost per order in rupees',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "The answer to this is the dark stores, the 2,500 to 4,000 square feet big stores that are located in 1.5 to 3 kilometer radius near your homes to ensure super quick delivery. And by the way, these stores are super big. For example, if your nearest kirana shop has about 1,500 SKUs, these stores can have 4 x a number of excuse. In fact, a highly efficient dark store can do a better gross merchandise value per square foot than a highly organized supermarket like Dmart. So while a dark store or blanket can do a GMV of 90,000 rupees per square fit, Mart can only do a GMV of 47,000 rupees per square fit. But how does this work? See, these stores are like supermarkets, but have no Hawkins, which means that only rider can go and collect stuff from there. These stores have a lot of inventory that comes from Mother Warehouse store, which is located in the outskirts. So to give you context, for every 40 dark stores located in the city, there is always a mother warehouse, which is located at the outskirts or city. And that is more than 10 times big as a dark store, which is about 20,000 to 1 lax, 75,000 square feet big. It is super huge. And companies don't set dark stores everywhere, by the way. They are smartly set based on multiple parameters like average household income of the area, peak time traffic of the area, infrastructure structure of the area, and also the population density. Also, there's usually about a staff of 25 to 30 people who are working in three shifts in these dark stores who would take care of the packaging. And as we've discussed earlier as well in the video, that the operating cost for a dark store comes at about rupees 22 for each order. And if you want to understand this calculation better, we have put it here. So you can pause the video and look at this table."
        },
        timeCost: '6.2'
      },
      {
        context: {
          dataTable: [
            {
              company: 'blanket',
              number_of_stores: 451,
              number_of_cities: 27,
              region: 'north and east India',
              GMV_percentage: 90,
              year_started: 2014
            },
            {
              company: 'Insta margin',
              number_of_stores: 450,
              number_of_cities: 25,
              region: null,
              GMV_percentage: null,
              year_started: null
            },
            {
              company: 'Zepto',
              number_of_stores: 30,
              number_of_cities: null,
              region: null,
              GMV_percentage: null,
              year_started: null
            },
            {
              company: 'Big Basket',
              number_of_stores: 350,
              number_of_cities: 35,
              region: null,
              GMV_percentage: null,
              year_started: null
            }
          ],
          fieldInfo: [
            {
              fieldName: 'company',
              description: 'Name of the company',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'number_of_stores',
              description: 'Total number of dark stores',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'number_of_cities',
              description: 'Total number of cities',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'region',
              description: 'Region of penetration',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'GMV_percentage',
              description: 'Percentage of GMV from top paid cities',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'year_started',
              description: 'Year the company started',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: "Now blanket has done a really solid job here as they have, right now, the highest number of dark stores with 451 stores in 27 cities compared to 450 stores of Insta margin, 25 cities, 30 of Zepto intensities and 350 stores of Big Basket in 35 cities. By the way, this is not something they built in a day because it was the first grocery app in the country, which started in 2014 as growers. So their team and their execution is way more experienced if you compare them with other competitors, and now they're just building on this and increasing their penetration throughout the country. By the way, they're mostly penetrated in north and east India, and 90% of the GMV comes from top paid cities. But as they enter south and other cities, this can be a huge opportunity for them as they already have an experience DNA running in the organization."
        },
        timeCost: '10.0'
      },
      {
        context: {
          dataTable: [
            {
              company: 'Big Basket',
              AOV: [400, 500],
              quarter: null,
              year: null
            },
            {
              company: 'Zepto',
              AOV: 450,
              quarter: null,
              year: null
            },
            {
              company: 'Instamar',
              AOV: 450,
              quarter: null,
              year: null
            },
            {
              company: 'Blanket',
              AOV: 635,
              quarter: null,
              year: null
            },
            {
              company: 'Blanket',
              AOV: 523,
              quarter: 'Q1',
              year: '2023'
            }
          ],
          fieldInfo: [
            {
              fieldName: 'company',
              description: 'Name of the company',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'AOV',
              description: 'Average Order Value in rupees',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'quarter',
              description: 'Fiscal quarter',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'year',
              description: 'Fiscal year',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: 'Now coming down to the second insight, which is cracking high average order value. But why are we talking about AOVs? Average order value plays a big role in quick commerce because bigger the average order value, bigger is the contribution margin for the company, which means that delivering just a set of bananas or apples is less profitable for blanket. Then delivering a set of bananas, apples, onions, tomatoes and a packet of bread together. And blanket has the highest average order value if you compare it with all the comparators. And just look at the stark difference by yourself. For big Basket, the AOV is about 400 to 500 rupees. For Zepto and Instamar, it is around 450+. And for blanket Au UV is about staggering 6,35 rupees. This is something that is definitely giving them an edge in pulling one of the most important levers in the ecosystem. In fact, in the last quarter, this number was 523 rupees at the start of Q1 fi 23. It just shows the speed at which they are growing really fast, and they have done this really well through their amazing SKU strategy.'
        },
        timeCost: '26.4'
      },
      {
        context: {
          dataTable: [
            {
              company: 'blinkit',
              market_share: 32,
              active_users: null,
              time_period: '2082'
            },
            {
              company: 'Instama',
              market_share: 52,
              active_users: null,
              time_period: '2082'
            },
            {
              company: 'Zeptos',
              market_share: [15, 28],
              active_users: null,
              time_period: '2082'
            },
            {
              company: 'Zomato',
              market_share: 56,
              active_users: 100000000,
              time_period: null
            },
            {
              company: 'blinkit',
              market_share: null,
              active_users: null,
              time_period: null
            }
          ],
          fieldInfo: [
            {
              fieldName: 'company',
              description: 'Name of the company',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'market_share',
              description: 'Market share percentage',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'active_users',
              description: 'Number of active users per month',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'time_period',
              description: 'Time period of the data',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: "Not talking about the third insight, new customer acquisition. See, blinkits market share has not been the highest forever. It was 32%2082. And in the same period, Instama's market share has fallen from 52%, while Zeptos has increased from 15 to 28%. And we had to talk about the elephant in the room, the Zomato Effect. See, Zomato is the biggest food delivery app that has more than hundred million active users every month on its app and a market share of more than 56%. When it comes to food delivery, these users are more than three ties what blanket has at the moment. So even getting 5% of Zomato's monthly active users as new customers could bring more than 33% rise to their current Mau base."
        },
        timeCost: '32.8'
      },
      {
        context: {
          dataTable: [
            {
              location: 'Toronto',
              neighborhood: 'Harbor Front',
              date: '2022',
              price: 480000,
              days_on_market: 400
            },
            {
              location: 'Toronto',
              neighborhood: 'Harbor Front',
              date: '2023',
              price: 460000,
              days_on_market: 400
            },
            {
              location: 'Toronto',
              neighborhood: 'Harbor Front',
              date: '2023',
              price: 450000,
              days_on_market: 400
            },
            {
              location: 'Toronto',
              neighborhood: 'Harbor Front',
              date: '2024',
              price: 430000,
              days_on_market: 400
            },
            {
              location: 'Toronto',
              neighborhood: 'Harbor Front',
              date: '2024',
              price: 430000,
              days_on_market: 400
            },
            {
              location: 'Toronto',
              neighborhood: 'Harbor Front',
              sales_comparison_year: '2009',
              sales_comparison: null
            }
          ],
          fieldInfo: [
            {
              fieldName: 'location',
              description: 'Location of the condo',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'neighborhood',
              description: 'Neighborhood of the condo',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'date',
              description: 'Date when the condo was listed',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'price',
              description: 'Listing price of the condo',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'days_on_market',
              description: 'Number of days the condo was on the market',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'sales_comparison_year',
              description: 'Year for sales comparison',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'sales_comparison',
              description: 'Sales comparison with the financial crisis year',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Want to show you something cute little condo in Toronto's Harbor Front neighborhood, bustling part of the city. It goes on the market in the summer of 2022. The sellers put it up for $480,000. It didn't sell early. 2023, it's back on the market for 460 k. No luck later that year, posted again at 4,50 k. Still nothing. And a few months ago, the sellers tried again. At $430,000, no takers. This condo was sitting on the market for more than 400 days without a sale. Right now in Canada's biggest cities, there's a ton of condos like this struggling to sell. A condo sales in Toronto, for example, haven't been this low since the financial crisis in 2009."
        },
        timeCost: '11.0'
      },
      {
        context: {
          dataTable: [
            {
              year: '2016',
              location: 'Toronto',
              average_price: 300000,
              interest_rate: 2.7,
              mortgage_payment: 1100,
              rent: 1660
            }
          ],
          fieldInfo: [
            {
              fieldName: 'year',
              description: 'The year of the data',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'location',
              description: 'The location of the condo',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'average_price',
              description: 'The average price of a one bedroom condo',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'interest_rate',
              description: 'The interest rate for the mortgage',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'mortgage_payment',
              description: 'The monthly mortgage payment',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'rent',
              description: 'The rent for the average one bedroom apartment',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Let's compare what a condo investment in Toronto looked like in 2016 to today. So according to the Toronto Real Estate Board, the average price of a one bedroom condo back then in 2016 was about three hundred thousand dollars and with 2016 interest rates about 2.7%, that worked out to a mortgage payment of about eleven hundred dollars a month. Rent for the average one bedroom apartment at that time was about sixteen hundred and sixty dollars. Not bad from an investor point of view, even with, you know, maintenance fees, property taxes, that condo is essentially paying for itself while you build equity."
        },
        timeCost: '9.2'
      },
      {
        context: {
          dataTable: [
            {
              property_type: 'one bedroom condo',
              location: 'Toronto',
              price: 550000,
              interest_rate: 6.8,
              mortgage_payment: 3000,
              average_rent: 2400
            }
          ],
          fieldInfo: [
            {
              fieldName: 'property_type',
              description: 'Type of property',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'location',
              description: 'Location of the property',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'price',
              description: 'Price of the property',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'interest_rate',
              description: 'Current interest rate',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'mortgage_payment',
              description: 'Monthly mortgage payment',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'average_rent',
              description: 'Average rent per unit',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Now what if you were to buy a one bedroom condo today in Toronto? That could cost you about 550 grand. So prices have very clearly gone up, but so have interest rates. The carrying costs on a property are far higher than they ever used to be. Well, not ever, but in recent memory. At current rates, 6.8%, maybe now you're paying more than $3,000 a month for your mortgage payment alone. Then you've got, you know, property taxes, maintenance fees and the average rent per unit like that, about 24 hundred dollars a month you're now paying out of."
        },
        timeCost: '6.3'
      },
      {
        context: {
          dataTable: [
            {
              time_period: 'last 12 months',
              price_change: -40000
            }
          ],
          fieldInfo: [
            {
              fieldName: 'time_period',
              description: 'The time period over which the price change occurred',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'price_change',
              description: 'The change in the price of the condo',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Now the renewals come in and you're losing a lot of money, but you've actually come to realize in the last 12 months the price of that condo has probably dropped about $40,000. So you're starting to enter into a state of actual fear."
        },
        timeCost: '3.1'
      },
      {
        context: {
          dataTable: [
            {
              region: 'Toronto',
              time_period: '1981-1990',
              average_size: 1000,
              size_change: null
            },
            {
              region: 'Toronto',
              time_period: '2016-2020',
              average_size: 650,
              size_change: -40
            }
          ],
          fieldInfo: [
            {
              fieldName: 'region',
              description: 'The region where the condos are located',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'time_period',
              description: 'The time period during which the data was collected',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'average_size',
              description: 'The average size of new condos in square feet',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'size_change',
              description: 'The percentage change in size of new condos',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: 'According to stats Cam, the average size of a new condo in Toronto has shrunk significantly over time. From 1981 to 1990, new condos were on average about 1,000 square feet. From 2016 to 2020, they were around 650 square feet or about 40% smaller. And if you ask anyone who lives in the downtown core right now, 650 square feet actually feels pretty big.'
        },
        timeCost: '7.6'
      },
      {
        context: {
          dataTable: [
            {
              city: 'Toronto',
              condo_size: 'larger',
              built_year: null,
              owner_occupancy_rate: 75,
              unit_size: null,
              days_to_sell: null,
              sale_month: null
            },
            {
              city: 'Vancouver',
              condo_size: 'larger',
              built_year: null,
              owner_occupancy_rate: 75,
              unit_size: null,
              days_to_sell: null,
              sale_month: null
            },
            {
              city: 'Toronto',
              condo_size: 'smaller',
              built_year: 2016,
              owner_occupancy_rate: 50,
              unit_size: null,
              days_to_sell: null,
              sale_month: null
            },
            {
              city: 'Vancouver',
              condo_size: 'smaller',
              built_year: 2016,
              owner_occupancy_rate: 50,
              unit_size: null,
              days_to_sell: null,
              sale_month: null
            },
            {
              city: null,
              condo_size: 'studio',
              built_year: null,
              owner_occupancy_rate: null,
              unit_size: 330,
              days_to_sell: 400,
              sale_month: null
            },
            {
              city: null,
              condo_size: 'two bedroom',
              built_year: null,
              owner_occupancy_rate: null,
              unit_size: 700,
              days_to_sell: 13,
              sale_month: '2024-10'
            }
          ],
          fieldInfo: [
            {
              fieldName: 'city',
              description: 'The city where the condos are located',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'condo_size',
              description: 'Size category of the condos',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'built_year',
              description: 'Year the condos were built',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'owner_occupancy_rate',
              description: 'Percentage of condos lived in by owners',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'unit_size',
              description: 'Size of the condo unit in square feet',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'days_to_sell',
              description: 'Number of days it took to sell the condo',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'sale_month',
              description: 'Month the condo was sold',
              fieldType: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: "Right now, for example, in Toronto and Vancouver, three quarters of larger condos, the ones, you know, maybe more suitable for a family built decades ago, those are being lived in by the people who own them. But for those much smaller condos built after 2016 with investors in mind, only about half are being lived in by owners. Remember that cute little studio that we showed you at the start that took 400 some days to sell. It was 330 square feet. Here's a two bedroom, 700 square foot unit in that same building. It's sold earlier this month on the first try in just 13 days. If we."
        },
        timeCost: '7.6'
      },
      {
        context: {
          dataTable: [
            {
              year: '2020',
              interest_rate: [3, 4, 1.25]
            },
            {
              year: '2021',
              interest_rate: [3, 4, 1.25]
            },
            {
              year: '2022',
              interest_rate: [3, 4, 1.25]
            }
          ],
          fieldInfo: [
            {
              fieldName: 'year',
              description: 'The year when the interest rates were observed',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'interest_rate',
              description: 'The interest rate observed in the given year',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Back then in 2020,2021, even into the beginning of 2022, we saw these historic low interest rates and people were taking out loans then and taking out bigger loans, right? They go and buy a house that they wouldn't have been able to afford. 3% or 4%, but they could afford at 1.25%. They called."
        },
        timeCost: '3.4'
      },
      {
        context: {
          dataTable: [
            {
              year: '2019',
              location: 'Ontario',
              house_price: 631990,
              down_payment_ratio: 20,
              mortgage_size: 500000,
              amortization_period: 25,
              fixed_rate: 2.9,
              monthly_payment: 2367
            },
            {
              year: '2024',
              location: 'Ontario',
              house_price: null,
              down_payment_ratio: null,
              mortgage_size: null,
              amortization_period: null,
              fixed_rate: 6,
              monthly_payment: 3075
            }
          ],
          fieldInfo: [
            {
              fieldName: 'year',
              description: 'The year of the mortgage',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'location',
              description: 'The location of the house',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'house_price',
              description: 'The price of the house',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'down_payment_ratio',
              description: 'The down payment ratio',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'mortgage_size',
              description: 'The size of the mortgage',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'amortization_period',
              description: 'The amortization period of the loan in years',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'fixed_rate',
              description: 'The fixed interest rate of the mortgage',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'monthly_payment',
              description: 'The monthly mortgage payment',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "No. So let's say there's a young couple in Ontario that bought an average priced house in 2019,$631,990. They put pretty standard down payments, down 20 percents, which leaves you with a mortgage size of about $500,000. Amortize the loan over 25 years, they take a five year fixed rate of 2.9%, which was also kind of standard at the time. That means they've been paying about, and I'm rounding to the nearest dollar here, 2,367 bucks for the past few years. But now that mortgage is up for renewal. Welcome to 2024. And the couple signs on to another fixed rate mortgage, but they have to do it at the bank's current rate, which is around 6%. That means their new monthly payment is, again, I'm rounding here, $3,075 a month or an extra 700 bucks a month. Right."
        },
        timeCost: '4.5'
      },
      {
        context: {
          dataTable: [
            {
              monthly_payment: 2200,
              interest_payment: 900,
              principal_payment: 1300
            },
            {
              monthly_payment: 2200,
              interest_payment: 2100,
              principal_payment: 100
            }
          ],
          fieldInfo: [
            {
              fieldName: 'monthly_payment',
              description: 'Total monthly mortgage payment',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'interest_payment',
              description: 'Monthly payment towards interest',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'principal_payment',
              description: 'Monthly payment towards principal',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Think of it this way. This circle is your $2,200 a month mortgage payment at a relatively low interest rate pending on the overall size of your mortgage, that might mean $900 of that payment is just servicing interest with the other 13 actually paying your loan back as the interest rate rises. Maybe now instead of 900 dollars a month, it's 20. One hundred dollars a month in interest. But your contract says your total payments stay the same, so you're still paying 22 dollars a month, meaning only 100 of those 22 hundred dollars are actually paying down your loan at that point. I have news for you. You're very close to being underwater, stuck in a perpetual state of paying down a loan where you're only barely paying down that loan. Welcome to lifelong debt, the time it will take to pay off his mortgage nearly doubled from."
        },
        timeCost: '2.6'
      },
      {
        context: {
          dataTable: [
            {
              year: '2024',
              mortgage_debt: 186000000000
            },
            {
              year: '2025',
              mortgage_debt: 350150000000
            }
          ],
          fieldInfo: [
            {
              fieldName: 'year',
              description: 'The year when mortgages are up for renewal',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'mortgage_debt',
              description: 'The amount of mortgage debt up for renewal',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Collectively, we're just starting to approach the edge of this cliff. RBC estimates about $186 billion worth of mortgages are up for renewal in 2024. Next year, it'll be 350,15 billion. That's a ton of mortgage debt that was taken on at historically low interest rates by people who may or may not have been able to afford getting into the housing market otherwise."
        },
        timeCost: '3.7'
      },
      {
        context: {
          dataTable: [
            {
              quarter: 'this quarter',
              year: 2024,
              amount_set_aside: 4300000000
            },
            {
              quarter: 'first quarter',
              year: 2023,
              amount_set_aside: 2150000000
            },
            {
              quarter: 'first quarter',
              year: 2022,
              amount_set_aside: 390909090.91
            }
          ],
          fieldInfo: [
            {
              fieldName: 'quarter',
              description: 'The specific quarter of the year',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'year',
              description: 'The specific year',
              fieldType: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'amount_set_aside',
              description: "Amount set aside by Canada's big six banks to cover bad loans",
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "What would you do if one day your neighbor, who you've known for years, you see him building a bomb shelter? Would you think that guy's crazy or would you wonder what does he know that I don't? Turns out banks right now are building a bombshelter. Just this quarter, Canada's big six banks have set $4.3 billion aside to cover bad loans. That's almost double what they set aside in the first quarter of last year and more than 11 times what they set aside in the first quarter before that."
        },
        timeCost: '3.5'
      },
      {
        context: {
          dataTable: [
            {
              percentage: 65
            },
            {
              percentage: 70
            }
          ],
          fieldInfo: [
            {
              fieldName: 'percentage',
              description: 'Percentage of people who have not noticed any radical increase in their payment',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "This is important. About 65% of them, 70% of them have not noticed any radical increase in their payment because their mortgage company sold a product where the payment did not go up when prime went up. Their payment did not go up when prime went up. That's the important part to understand, because it means you might have people ultimately paying more without even realizing it."
        },
        timeCost: '2.8'
      },
      {
        context: {
          dataTable: [
            {
              date: '2026-07',
              rate_change: 0.25,
              monthly_increase: 20
            }
          ],
          fieldInfo: [
            {
              fieldName: 'date',
              description: 'The date or time period of the expectation',
              fieldType: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'rate_change',
              description: 'The expected change in rates',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'monthly_increase',
              description: 'The expected monthly increase',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: 'Now, luckily, most economists do expect rates to keep dropping. According to that same RBC report, it still might not be enough to, quote, save this cohort to get them down to a more manageable monthly increase like 20%. They argue the bank of Canada would have to lower its prime rate way down to around point two five % by July 2026, something they admit is an unreasonable expectation.'
        },
        timeCost: '2.9'
      },
      {
        context: {
          dataTable: [
            {
              location: 'Vancouver',
              income_spent_on_housing: [70, 75]
            },
            {
              location: 'Toronto',
              income_spent_on_housing: [70, 75]
            }
          ],
          fieldInfo: [
            {
              fieldName: 'location',
              description: 'The location where the income is being spent on housing',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'income_spent_on_housing',
              description: 'The percentage of income spent on housing',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "The old rule of thumb in my day was you spend about a third of your income on housing. Now you'll hear anecdotal evidence, particularly in places like Vancouver, Toronto, where you'll hear 70 to 75% of income is being spent on housing. So in those cases, then if they have to reset at a higher interest rate, it's the house that's gonna go down first. So."
        },
        timeCost: '2.3'
      },
      {
        context: {
          dataTable: [
            {
              market_type: 'existing',
              sales_pace_annual: 3700000,
              sales_pace_monthly: 309000,
              sales_pace_peak_monthly: 500000,
              inventory: 1100000
            },
            {
              market_type: 'new',
              sales_pace_annual: 619000,
              sales_pace_monthly: 51000,
              sales_pace_peak_monthly: 90000,
              inventory: 479000
            }
          ],
          fieldInfo: [
            {
              fieldName: 'market_type',
              description: 'Type of housing market',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'sales_pace_annual',
              description: 'Annual sales pace of homes',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'sales_pace_monthly',
              description: 'Monthly sales pace of homes',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'sales_pace_peak_monthly',
              description: 'Peak monthly sales pace during the pandemic',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'inventory',
              description: 'Current level of inventory for sale',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: 'In order to get the most accurate reading on the US housing market inventory situation, we need to consider both supply and demand. Supply in this case is the level of inventory for sale and demand is the current case of sales volume. If we start with sales volume, we can see the existing home market has a sales pace of roughly 3.7 million homes per year, while the new home market has a sales pace of 619,000 homes per year. Right off the bat, we can see how the existing home market is almost six times larger than the new construction market in terms of sales volume. Both of these markets, existing and new, have seen a huge reduction in sales volume or buyer demand since interest rates have increased, as affordability is out of reach for most people. If we take this annual sales pace and divided by 12, we can get an idea of the average sales pace per month. Of course, there are seasonal patterns, but if we normalize for those effects, we can see that the current monthly sales pace in the existing home market is roughly 309,000, and the new construction market is selling about 51,000 homes per month. At the peak of the housing boom during the pandemic, the existing hallmark had a sales pace of 500,000 units per month and the new construction market was selling nearly 90,000 units per month. Now that we have an idea of the current level of demand, we have to look at supply or the level of inventory for sale in the existing home market. There are currently 1.1 million homes for sale, one of the lowest on record. If we just look at inventory alone. In the new construction market, there are 479,000 units for sale, one of the highest levels on record, only surpassed by the housing bubble of 2007.'
        },
        timeCost: '3.9'
      },
      {
        context: {
          dataTable: [
            {
              market_type: 'existing home market',
              month_supply: 3.7
            },
            {
              market_type: 'new construction market',
              month_supply: 9.3
            }
          ],
          fieldInfo: [
            {
              fieldName: 'market_type',
              description: 'Type of housing market',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'month_supply',
              description: 'Number of months of inventory available at the current pace of sales',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "You can clearly see how there is nuance to the situation of US housing inventory, the best measure of US housing inventory takes into account both supply and demand and is called the month supply. In other words, how many months of inventory are available for the current pace of sales value. If we take the current level of inventory for both the existing hall market and the new hall market, and we divide it by the current monthly pace of sales. We can see how many months it would take to sell all the inventory at the current pace of sales in the existing home market, that month's supply figure or the inventory level divided by the sales volume, 3.7. In the new construction market, it is 9.3."
        },
        timeCost: '4.2'
      },
      {
        context: {
          dataTable: [
            {
              market_type: 'existing home',
              month_supply: 3.7,
              date: '2024-05'
            },
            {
              market_type: 'existing home',
              month_supply: 1.6,
              date: '2022-01'
            },
            {
              market_type: 'new construction',
              month_supply: 9.3,
              date: '2024-05'
            },
            {
              market_type: 'total US housing',
              month_supply: 4.5,
              date: '2024-05'
            },
            {
              market_type: 'total US housing',
              month_supply: 2.6,
              date: '2021-01'
            }
          ],
          fieldInfo: [
            {
              fieldName: 'market_type',
              description: 'Type of housing market',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'month_supply',
              description: 'Month supply of homes in the market',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'date',
              description: 'Date of the data',
              fieldType: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: "Generally speaking, the 5.5 to 6.0 level is considered a balanced market where there is no significant upward or downward pressure on prices. When the month's supply level is below 5.5, that means there is very little inventory available for today's market conditions and prices generally rise. On the flip side, a high level of month's supply means there's too much inventory and prices must fall. The existing home market has a month supply of 3.7, which is very low, but it's been increasing since the absolute historic level of one point six in January 2022. Never in the history of the US housing market has the month's supply of existing homes been that low. This created a very unhealthy situation in the existing home market. The inventory situation in the existing hall market is still very tight, but it's now at the highest level since before for the pandemic. The new construction market is a completely different ballgame with a month supply at 9.3, super high and way above the balanced 6.0 level. There is way more detail to the situation in the new construction market that we'll uncover in just a moment. If we look at the total US housing market situation, both existing and new construction, the aggregate month supply figure has increased to 4.5. So yes, the total inventory situation is still very tight on a national level, but the level is rising and at the highest point since 2,015. The monthly numbers are volatile, so let's look at a yearly average to make things more clear. This shows the month's supply for the total US housing market by year. 2024 is a partial year, and the current level as of May 2024 is also noted in the chart. As of May 2024, the total month supply situation is 4.5, which it hasn't been since 2015. You can also see the four years where the total month supply was below 4.0, which is extremely tight. And you can also see the 2021 situation at 2.6, which was crazy unhealthy. One major point is that this current 4.5 level is the national average. But as we know, real estate is very regional. So this means that there are some markets that are near a month supply of 6 and feeling downward price pressure, while some markets are still down at 3 and seeing prices rise with multiple offers. The new home market with a month supply of 9.3 is way above the balance level of six point zero, and there are price cuts and discounts in that market."
        },
        timeCost: '7.0'
      },
      {
        context: {
          dataTable: [
            {
              month: 'June',
              builders_cut_prices_percentage: 29,
              average_price_reduction: 6,
              builders_use_incentives_percentage: 61,
              supply_level_months: 9.3,
              units_for_sale: 479000,
              sales_pace_per_month: 50000,
              completed_inventory_percentage: 20,
              under_construction_or_not_started_percentage: 80
            }
          ],
          fieldInfo: [
            {
              fieldName: 'month',
              description: 'The month of the report',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'builders_cut_prices_percentage',
              description: 'Percentage of builders who cut home prices',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'average_price_reduction',
              description: 'Average price reduction percentage',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'builders_use_incentives_percentage',
              description: 'Percentage of builders using sales incentives',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'supply_level_months',
              description: 'Supply level in months',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'units_for_sale',
              description: 'Number of units for sale in the new construction market',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'sales_pace_per_month',
              description: 'Current pace of sales per month',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'completed_inventory_percentage',
              description: 'Percentage of inventory that is completed',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'under_construction_or_not_started_percentage',
              description: 'Percentage of inventory that is either under construction or not yet started',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "In June, the National Association of homebuilders reported that 29% of builders cut home prices with an average price reduction of 6%. And 61% of builders use sales incentives like mortgage rate ByteDance to boost sales. But we need to talk about the new hall market and the 9.3 month supply level in a bit more detail, because there is more than what meets BI in the new construction market. Currently, there are 479,000 units for sale in the new construction market and a current pace of sales of about 50 thousand per month. In the new home market, a home could be listed for sale when it's completed, under construction or not yet started. If we look at the percentage of inventory that is completed, we can see that of those 479,000 new home units for sale, Only 20% are completed, which means 80% are either under construction or not yet started."
        },
        timeCost: '9.0'
      },
      {
        context: {
          dataTable: [
            {
              period: 'most acute part of the US housing shortage',
              completed_inventory_ratio: 10,
              new_home_sales_pace: null,
              months_of_inventory: null
            },
            {
              period: 'normal',
              completed_inventory_ratio: [20, 30],
              new_home_sales_pace: null,
              months_of_inventory: null
            },
            {
              period: '2008 downturn',
              completed_inventory_ratio: 50,
              new_home_sales_pace: null,
              months_of_inventory: null
            },
            {
              period: 'current',
              completed_inventory_ratio: 20,
              new_home_sales_pace: 50000,
              months_of_inventory: 1.9
            }
          ],
          fieldInfo: [
            {
              fieldName: 'period',
              description: 'Time period or event',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'completed_inventory_ratio',
              description: 'Ratio of completed new home inventory for sale',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'new_home_sales_pace',
              description: 'Current pace of new home sales',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'months_of_inventory',
              description: 'Months of completed inventory for sale',
              fieldType: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "The level of completed new home inventory for sale fell below 10% during the most acute part of the US housing shortage. Normally, in between 20% and 30% of new construction inventory is completed. During really bad downturns like 2008, builders were sitting on almost 50% completed inventory, which is what led to dramatic price cuts and big layoffs of construction crews. The level of completed inventory is now back into the normal range at 20%, and it's rising, which means that if we move towards 30%, price cuts will get more intense and construction crews will be at high risk of job losses. If we take the current 50,000 new home sales pace and divide that by the amount of completed new home inventory for sale. We can see that there's currently about 1.9 months of completed inventory for sale, which is getting past the average level and into the range consistent with recessions and job losses for construction crews. If the home builders have a lot of completed new home inventory for sale, they aren't going to apply for new building permits and build even more homes. And that's exactly what we're starting to see."
        },
        timeCost: '8.1'
      },
      {
        context: {
          dataTable: [
            {
              age_group: '55 and over',
              percentage: 30
            }
          ],
          fieldInfo: [
            {
              fieldName: 'age_group',
              description: 'Age group of the homeless population',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'percentage',
              description: 'Percentage of the homeless population',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: "Homelessness has been rare since the reemergence of homelessness in the mid 1980s. Usually it's been people in their 20s and 30s and 40s, but now we're approaching close to 30% of the adult homeless population are people 55 and over."
        },
        timeCost: '3.1'
      },
      {
        context: {
          dataTable: [],
          fieldInfo: [],
          text: "Exports from China are rising fast and US officials are nervous about this gap. We're not gonna let China flood our market. Sound familiar? There has to be a level playing field for American companies competing in China. In the early 2 Chinese factories like this one pumped out clothes and flags and cars. The sticker prices were cheap. But there was another price to be paid, American jobs. Every single employee of this plant, we'll be out of work by January. 15 years and almost 6 million jobs later, economists are debating what price another wave of imports could exact from American workers. But two key differences between then and now may have a new effect on the US economy. Look at this line. Before 2001, American manufacturing employed over 17 million people, making toys, furniture, paper goods and much more. Then word began to circulate that China was joining the World Trade Organization. And here's what it did. Joining the WTO meant China faced fewer tariffs and restrictions from its trading partners, and the result was dubbed the China."
        },
        timeCost: '58.0'
      },
      {
        context: {
          dataTable: [
            {
              region: 'United States',
              company: null,
              job_loss: 2500000,
              time_period: '2000-2007',
              job_loss_percentage: null,
              industry: null
            },
            {
              region: 'Silicon Valley',
              company: 'Apple, HP, Cisco',
              job_loss: null,
              time_period: 'after 2001',
              job_loss_percentage: 50,
              industry: 'manufacturing'
            },
            {
              region: 'Cedar Rapids, Iowa',
              company: null,
              job_loss: null,
              time_period: null,
              job_loss_percentage: 46,
              industry: 'furniture and machinery'
            },
            {
              region: 'Auto Alley',
              company: null,
              job_loss: null,
              time_period: null,
              job_loss_percentage: null,
              industry: null
            }
          ],
          fieldInfo: [
            {
              fieldName: 'region',
              description: 'Geographical region',
              fieldType: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'company',
              description: 'Company name',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'job_loss',
              description: 'Number of jobs lost',
              fieldType: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'time_period',
              description: 'Time period during which jobs were lost',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'job_loss_percentage',
              description: 'Percentage of job loss',
              fieldType: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'industry',
              description: 'Industry type',
              fieldType: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: "2.5 million Americans lost their jobs from 2000 to 2007. They're represented by the blue on this map. Look at this dark blue area here. That's Silicon Valley, where companies like Apple, HP and Cisco used to manufacture goods. After 2001, they moved most of their production to China, causing a 50+ percent drop in manufacturing jobs in the county, this other dark blue county, Cedar Rapids, Iowa, lost 46% of their manufacturing jobs, primarily in furniture and machinery. But this lighter blue region here was largely spared. It's called Auto Alley. The main reason it succeeded where, say, Silicon Valley's manufacturing failed, is due to investment from competitors like Japan."
        },
        timeCost: '4.7'
      }
    ]
  }
];
