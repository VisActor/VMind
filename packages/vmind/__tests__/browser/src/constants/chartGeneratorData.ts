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
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '党派',
              description: '党派名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '席位数',
              description: '党派获得的席位数',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '地图带你看懂法国大选。 2024 年法国议会选举结果揭示了法国社会的撕裂，没有任何党派能获得 577 个议题中的绝对多数。左翼联盟、新人民战线执政党中间派联盟和极右翼国民联盟分别占据 182 席、 168 席、 143 席。除了这三家以外，其余党派席位最多的也只有右翼共和党的 48 席，因此左翼联盟、执政党和极右翼算是形成了三分天下的格局。今天我们便结合地图和数据，聊一聊法国大选。本期视频的所有分析均为个人观点，仅供参考。在开始之前，我先快速的放一下各党派在几个主要政治议题上的立场，有需要的朋友可以截图保存一下。'
        },
        timeCost: '3.9'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '选区数量',
              description: '全国选区的总数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '选区人口范围',
              description: '每个选区的人口范围',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '城市',
              description: '人口密集的大城市',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '现在我们进入正题，首先需要说明法国的选区制度，全国共有 577 个选区，每个选区包括 10- 12 万的人口密集的地方选区就小，人口稀少的区域选区域就大。因此地图上各个政党所占的面积并不能与其票数划等号，而是要看具体的选区分布在人口密集的大城市，譬如巴黎、里昂、马赛，虽然看起来面积小，实际上选区数量很多，占的比重很大。'
        },
        timeCost: '3.0'
      },
      {
        context: {
          dataTable: [
            {
              地区: '西北部',
              失业率年份: '2022',
              失业率排名: '最低的20个省'
            },
            {
              地区: '西北部',
              失业率年份: '2022',
              失业率排名: '21-40低的省份'
            },
            {
              政党: '右翼共和党',
              席位数: 48
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
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '法国的不同地区',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '失业率年份',
              description: '失业率数据对应的年份',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '失业率排名',
              description: '失业率排名',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '政党',
              description: '政党名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '席位数',
              description: '政党获得的席位数',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '尽管如此，马克龙强调市场自由化，支持创新和创业，对欧盟一体化和国际合作的开放还是得到了许多大城市选民的支持。大城市仍然是马克龙的重要支持来源。除了大城市外，我们刚才提到过法国东北地区工业的衰落，其实在法国的西北地区又是另一番景象。之前那张关于中小工业城市分布的途中，我们可以清晰的看到西北地区的工业对于当代法国的重要性，当然工业只是一个缩影。我们再来看失业率地图，黄色代表 2022 年失业率最低的 20 个省，橙色是 21- 40 低的省份，可以看出西北部地区的失业率明显低于东北部。再看移民分布地图，西北部地区因为大城市少，而且离地中海更远，接受的移民也比较少。综上，西北地区的经济较为稳定，而且不受移民带来的社会问题困扰，日子过得比较舒服，这些选民对于未来持乐观态度，也成为了马克龙的另一主要票仓。除了以上三大势力外，浅蓝色代表的右翼共和党也获得了 48 个席位。他们的支持者主要位于经济同样比较富足，但是政治观点更为保守的地区。这里我就不展开讲总结。本期视频我们从法国官方的报告与数据出发，从经济与人口地理的角度分析了法国的大选结果。左翼联盟新人民战线以大城市为根基拿下最多的 182 席，马克龙的执政党中间派联盟则凭借大城市和西北地区的支持者取得了 168 席。乐旁的极右翼国民联盟则主要扎根于东北与东南地区，以 143 起居于第三这样的三分割据局面使得法国议会缺乏绝对多数，并且三方势力相差不大。可以预见在未来法案的通过上会面临极大的阻碍。举例来说，左翼和极右翼甚至存在联手撤回延迟退休法案的理论可能。虽然实际操作起来也面临很多困难，双方都不太愿意和对方合作，但即便是理论，可能也已经能表明未来的不确定性。'
        },
        timeCost: '0.1'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '季度',
              description: '财报季度',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '营业收入',
              description: '营业收入金额',
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
            },
            {
              fieldName: '净利润变化',
              description: '净利润变化百分比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '股票市值变化',
              description: '股票市值变化金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '住手，你们住手，不要再砸了，你们不要再砸了。万万没想到，瑞幸和库迪的九块九大战，快把星巴克给卷死了。前段时间，星巴克公布了第二季度财报，营业收入 85.6 亿美元，同比下降了2%，净利润大跌15%，股票市值一天内蒸发了 1, 150 亿人民币。另一方面，星巴克的咖啡也在悄悄降价。如果你手机上有星巴克的APP，几乎每天都会收到 5 张以上的优惠券，比如满60.10、满75.15、任意新冰乐 7 折等等，部分单品的团购价优惠下来低至 9 元。终于， 9.9 的风还是卷到了星巴克。在过去很长一段时间里，星巴克是小资生活的代表，一杯咖啡动辄几十块钱，也只有电视剧里那些白领们和云淡风轻的走进去，熟练地点一杯拿铁，找个位置坐下，悠闲地打开电脑喝咖啡。岁月静好人间，值得有人点一杯星巴克，朋友圈能发十几条动态，有人为了抢星巴克限量版的猫爪杯，能通宵排队，甚至大打出手。'
        },
        timeCost: '3.8'
      },
      {
        context: {
          dataTable: [
            {
              国家: '美国',
              品牌: '星巴克',
              饮品: '大杯美式咖啡',
              价格: 2.95,
              平均月工资: 6228,
              最低时薪: 7.25,
              主力消费人群月薪: null
            },
            {
              国家: '中国',
              品牌: '星巴克',
              饮品: '饮品',
              价格: 30,
              平均月工资: null,
              最低时薪: null,
              主力消费人群月薪: 60000
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
              fieldName: '品牌',
              description: '咖啡品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '饮品',
              description: '饮品名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格',
              description: '饮品价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '平均月工资',
              description: '国家的平均月工资',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '最低时薪',
              description: '国家的最低时薪',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '主力消费人群月薪',
              description: '主力消费人群的月薪',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '星巴克在中国国内的定位一直都是高端咖啡品牌，但是很多人不知道的是，它在国外的定位其实是平民咖啡，在美国一杯星巴克大杯美式咖啡大概是 2.95 美元，而根据美国劳工部的统计，美国平均月工资是 6, 228 美元，最低时薪是 7.25 美元，这是啥意思呢？ 1002.65 美元的星巴克还不到美国人平均月收入的 2, 000 份之一，也就是平常坐一趟地铁的价格吧。而在中国市场，星巴克的饮品价格普遍要超过 30 元一杯。如果按照美国的对应消费力，它的主力消费人群应该是月薪至少6万元的人。'
        },
        timeCost: '5.6'
      },
      {
        context: {
          dataTable: [
            {
              日期: '2019-02',
              产品: '粉爪杯',
              原价: 199,
              最高价格: 1800
            }
          ],
          fieldInfo: [
            {
              fieldName: '日期',
              description: '具体日期',
              type: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '产品',
              description: '产品名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '原价',
              description: '产品原始售价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '最高价格',
              description: '产品在网上的最高价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '2019 年2月，星巴克就发售了一款粉爪杯，那它长这样？售价 199 元，但是在网上最高炒到了 1, 800 元。有人寒冬腊月在星巴克门口通宵排队，就是为了买到这么一个杯子。还有人因为排队顺序大打出手，最后喜提免费食宿。靠着这些营销方法，在很长一段时间里，普通人对于星巴克是仰望的，觉得去星巴克消费是很有品的，再往前推十年，你甚至可以看到有人去星巴克点一杯咖啡就可以发十几条朋友圈的各种角度各种场景，还要配文低调有实力，天天喝都喝腻了好像呢？甚至有人专门发帖认真的提问，第一次去星巴克主要注意什么？怎么装的像老手呢？我一开始还以为是来搞笑和反讽的，没想到点开帖子此还真的是教大家怎么去星巴克抓老手的，包括但不限于怎么下载APP，问店员这周用的是啥肚子萃取时间是多少？张度和烘焙度怎么样？要不要加糖和加奶？这唬得我一愣一愣的，但是时过境迁，如今星巴克已经支棱不起来了，一边是疯狂降价买三送一搞促销，一边是继续下沉到四五线城市。'
        },
        timeCost: '3.9'
      },
      {
        context: {
          dataTable: [
            {
              公司: '星巴克',
              战略愿景年份: '2025',
              d级市场数量: 300,
              县域市场数量: 3000,
              门店数量: 7000
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
              fieldName: '战略愿景年份',
              description: '战略愿景发布的年份',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: 'd级市场数量',
              description: 'd级市场的数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '县域市场数量',
              description: '县域市场的数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '门店数量',
              description: '公司在中国的门店数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '星巴克近期发布的 2025 中国战略愿景当中，中国总部直言不讳地表示，星巴克看中的不仅仅是全国 300 多个 d 级市场，也包括近 3, 000 个县域市场。星巴克的愿景也体现在它的选址变化上，它在中国的门店已经突破了 7, 000 家，但是这开店位置却让人越来越看不懂了。'
        },
        timeCost: '3.0'
      },
      {
        context: {
          dataTable: [
            {
              咖啡品牌: '星巴克',
              咖啡类型: '美式',
              价格: 30
            },
            {
              咖啡品牌: '瑞幸',
              咖啡类型: '库里',
              价格: 9.9
            }
          ],
          fieldInfo: [
            {
              fieldName: '咖啡品牌',
              description: '咖啡的品牌名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '咖啡类型',
              description: '咖啡的类型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格',
              description: '咖啡的价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '一家卖咖啡的店。星巴克没落的第二个原因是当代年轻人更偏向实用消费主义。坦白讲，大部分人喝咖啡其实就是为了遮住那点咖啡因，好让自己在一天的工作中保持清醒。你跟不懂咖啡的人聊什么豆子产地、风味，他只会回你一句，冰美式和中药有什么区别啊？如果你面前有三杯咖啡，第一杯是星巴克的 30 元美式，后面两杯是瑞幸库里的 9 块 9 咖啡也让你买单，大部分人都会选择后面两个，当然也有人会吹星巴克的豆子有多么多么的好，所以它买的这么贵也是值得的。'
        },
        timeCost: '1.4'
      },
      {
        context: {
          dataTable: [
            {
              月份: '6月',
              指标: 'M2',
              同比增长率: 6.2,
              预期增长率: 6.8,
              剪刀差: null,
              人民币存款增加: null,
              居民存款增加: null,
              时间范围: null
            },
            {
              月份: '6月',
              指标: 'M1',
              同比增长率: -5,
              预期增长率: -5.4,
              剪刀差: null,
              人民币存款增加: null,
              居民存款增加: null,
              时间范围: null
            },
            {
              月份: '6月',
              指标: 'M2-M1',
              同比增长率: null,
              预期增长率: null,
              剪刀差: 11.2,
              人民币存款增加: null,
              居民存款增加: null,
              时间范围: null
            },
            {
              月份: '6月',
              指标: '人民币存款',
              同比增长率: null,
              预期增长率: null,
              剪刀差: null,
              人民币存款增加: 2460000000000,
              居民存款增加: 2140000000000,
              时间范围: null
            },
            {
              月份: null,
              指标: '人民币存款',
              同比增长率: null,
              预期增长率: null,
              剪刀差: null,
              人民币存款增加: 11460000000000,
              居民存款增加: 9270000000000,
              时间范围: '上半年'
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
              fieldName: '指标',
              description: '经济指标',
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
            },
            {
              fieldName: '预期增长率',
              description: '预期增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '剪刀差',
              description: 'M2与M1的剪刀差',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '人民币存款增加',
              description: '人民币存款增加量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '居民存款增加',
              description: '居民存款增加量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '时间范围',
              description: '数据对应的时间范围',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '咱聊一下最新的重磅数据，反正挺复杂的，国内6月 M2 同比增长6.2%，预期6.8%。 M1 同比下滑5%，预期下滑5.4%。 M M 一剪刀差走扩至 11.2% 再创新高。6月人民币存款增加 2.46 万亿，其中居民存款增加 2.14 万亿，增量几乎全都是老百姓存的。与 M1 的下滑相对，上半年人民币存款总共增加了 11.46 万亿，其中居民存款增加 9.27 万亿。大头也是老百姓，但增速逐月放缓。'
        },
        timeCost: '10.9'
      },
      {
        context: {
          dataTable: [
            {
              日期: '7月11日',
              事件: '美国公布CPI数据超预期回落',
              降息预期概率: null
            },
            {
              日期: '7月30日',
              事件: '美联储议息会议',
              降息预期概率: 7
            },
            {
              日期: '9月18日',
              事件: '美联储议息会议',
              降息预期概率: 90
            },
            {
              日期: '7月10日',
              事件: '美联储鲍威尔国会听证会',
              降息预期概率: null
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
              fieldName: '事件',
              description: '事件描述',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '降息预期概率',
              description: '市场对美联储降息的预期概率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '7月 11 日晚上，由于美国公布的 CPI 数据超预期回落，让市场对美联储降息预期大幅升温。从这场所的美联储观察工具看，虽然7月 30 一日的美联储议息会议，市场预期不降息的概率仍然是达到93%，但9月 18 日的美联储议息会议，市场预期降息一次的概率是达到90%，这比起上个月概率是上升很多。不过我还是得强调一下，这个美联储观察工具将来只能反映市场当前的预期态度，不能拿来预测美联储货币政策，因为这个概率是会不断随着最新经济数据变化而变化。比如要是下个月美国 CPI 出现较大反弹，那9月降息的概率就会大幅下降。而这次市场预期美联储9月降息的概率大幅上升，主要有两个原因，一、美联储鲍威尔在7月 10 日的国会听证会上整体态度偏戈。鲍威尔称，劳动力市场降温意味着持续高通胀的潜在源头已经减弱。他还表示，就业市场的进一步疲软可能是不必要的，也是不受欢迎的。鲍威尔说，通胀方面的工作还没有完成，我们还有更多工作要做，但与此同时，我们需要注意劳动力市场现况，我们已经观察到劳动力市场出现相当明显的疲软，有着新美联储通讯社之称的知名记者尼奇默尔斯认为，鲍威尔本周其实已暗示美联储的利率政策即将开始改变方向。'
        },
        timeCost: '4.1'
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
              type: 'date',
              dateGranularity: 'day',
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
              fieldName: 'CPI同比',
              description: 'CPI同比增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场预期CPI同比',
              description: '市场预期的CPI同比增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '前值CPI同比',
              description: '前值的CPI同比增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: 'CPI环比',
              description: 'CPI环比增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '第二个原因是7月 11 日晚上 8 点半美国劳工部公布的通胀数据，6月 CPI 是同比上涨3%，市场预期值3.1%，前值3.3%。这次美联储 CPI 回落，更关键是 CPI 环比是负增长0.1%，这是美国 2020 年5月以来 CPI 环比首次出现下降，而且美国 2020 年5月还是因为疫情导致的 CPI 骤降，是比较特殊时期，所以美国 CPI 环比负增长确实不太常见。但仔细看美国 VI 月 CPI 的具体构成，感觉猫腻还是不少的。'
        },
        timeCost: '5.2'
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
              type: 'string',
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
              fieldName: '指标',
              description: '经济指标',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '变化率',
              description: '变化的百分比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '美国 VI 月 CPI 下降的主要贡献是汽油价格下跌。美国 VI 月汽油价格下跌了3.8%，抑制了当月通胀，抵消了食品和住房价格 0.2% 的上涨。比较诡异的是，美国原油期货价格6月是明明出现大幅上涨，这是因为原油期货价格传导到汽油价格有一些迟滞效应，但那样的话，下个月公布的 CPI 数据，汽油价格可能就得反弹了。要是下个月公布的 CPI 数据，汽油价格还继续下降，那就实在说不过去了。美国刨除能源和食品价格的核心通胀率6月是3.3%，但整体降幅还是低于CPI。'
        },
        timeCost: '8.2'
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
              修正后非农就业人口: null
            },
            {
              国家: '美国',
              月份: '5月',
              服务业通胀同比: null,
              非农就业人口: null,
              市场预期非农就业人口: null,
              修正前非农就业人口: 272000,
              修正后非农就业人口: 218000
            },
            {
              国家: '美国',
              月份: '4月',
              服务业通胀同比: null,
              非农就业人口: null,
              市场预期非农就业人口: null,
              修正前非农就业人口: 165000,
              修正后非农就业人口: 108000
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
              fieldName: '月份',
              description: '具体月份',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '服务业通胀同比',
              description: '服务业通胀同比增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '非农就业人口',
              description: '非农就业人口数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场预期非农就业人口',
              description: '市场预期的非农就业人口数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '修正前非农就业人口',
              description: '修正前的非农就业人口数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '修正后非农就业人口',
              description: '修正后的非农就业人口数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '美国通胀目前最顽固的就是服务业通胀，美国 VI 月服务业通胀仍然是同比上涨5%。美国毕竟是服务业为主的国家，服务业通胀还高居5%，美国要说自己已经控制住通胀，完全就是忽悠人。不过虽然美国大选临近，美国现在经济数据基本是为选型服务，比如已经假的不能再假的美国非农就业数据，美国 VI 月非农就业人口增加20.6万人，高于市场预期的 19 万人。然而美国同时把5月数据从 27.2 万人大幅下修至 21.8 万人，4月从 16.5 万人修正至10.8万人，修正后两个月合计较修正前减少 11.1 万人。'
        },
        timeCost: '9.4'
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
              事件: '股市大涨'
            },
            {
              年份: '2008',
              事件: '金融危机爆发，股市大跌'
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
              type: 'date',
              dateGranularity: 'day',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '股市',
              description: '股市名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '涨跌幅',
              description: '股市涨跌幅度',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '年份',
              description: '年份',
              type: 'year',
              dateGranularity: 'year',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '事件',
              description: '事件描述',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '我注意到虽然这次市场大幅提高了美联储9月降息概率，但美股和日股反而不涨反跌，纳斯达克在7月 11 日是下跌了2%，日股在7月 12 日也跟随下跌了2.45%。这是市场反身性效应的某种预演，股市炒的是预期，之前美股和日股是基于美联储降息预期，已经提前涨了一年多了，那么当美联储真正降息之后，市场是可能出现反身性效应，也就是所谓利好落地势利空的说法。当然股市走势千变万化，这也只是其中一种可能性。历史的参考例子，比如 2004 年美联储降息， 2006 年停止加息， 2007 年开始降息，但股市是一直涨到 2007 年底，随后自带危机爆发，股市开始大跌。我之前也梳理过，从 1980 年以来，美联储每次加息超过 5% 的幅度，首次加息后的 2- 4 年内都会爆发金融危机，这次美联储是 2022 年开始加息，所以按照历史路径， 2024 年到 2026 年是有可能爆发世界金融危机，这个结合当前国际局势和地缘形势，还是有挺大的可能性。'
        },
        timeCost: '8.2'
      },
      {
        context: {
          dataTable: [
            {
              地区: '黑龙江省',
              时间范围: '10年',
              荒废比例: 60,
              荒废小学数量: 1900,
              小学总数: null
            },
            {
              地区: '东北',
              时间范围: '10年',
              荒废比例: 50,
              荒废小学数量: 6800,
              小学总数: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '地理区域',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间范围',
              description: '时间范围',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '荒废比例',
              description: '荒废的小学比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '荒废小学数量',
              description: '荒废的小学数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '小学总数',
              description: '小学总数',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '以前的小学空荡荡的，老年人养起了鸡鸭鹅狗，彻底荒废了整个黑龙江省， 10 年时间荒废了近六成，小学加起来有 1, 900 余所，整个东北十年荒废了 6, 800 余所小学，少了一半。'
        },
        timeCost: '3.6'
      },
      {
        context: {
          dataTable: [
            {
              地区: '河南',
              年份: '2023-2027',
              小学学龄人口下降: 2000000,
              小学学龄人口下降比例: 20
            },
            {
              地区: '全国',
              年份: null,
              小学学龄人口下降: null,
              小学学龄人口下降比例: 90
            },
            {
              地区: '上海',
              年份: null,
              小学学龄人口下降: null,
              小学学龄人口下降比例: null,
              总和生育率: 60
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '具体地区',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '小学学龄人口下降',
              description: '小学学龄人口预计下降人数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '小学学龄人口下降比例',
              description: '小学学龄人口预计下降比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '总和生育率',
              description: '总和生育率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '而小学缺孩子这个趋势早已经蔓延至全国各地了。东部的兹西县，有的小学一个班只有一个学生。华南的徐文县，去年某小学开学，一年级也只有一个学生。中部人口大省河南，据测算， 2023- 2027 年小学学龄人口预计下降 200 多万人，缩水超两成，出现了基数的坍塌。从全国来看，基于学龄人口的预测显示，全国超 1, 400 个县域中，近九成县域小学学龄人口预计下滑，小学鹤岗化以谁也没想到的方式在扩散，从东北开始到大江南北，下一步可能是上海最新的总和生育率只有 0.6 了，该来的总是要来，从民政局冷冷清清到妇产科缺孩子，再到幼儿园关停潮，现在轮到了小学关停潮，这个传播链条还在扩散。'
        },
        timeCost: '7.0'
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
              楼盘: '某楼盘',
              原价: 1600000,
              现价: 390000
            }
          ],
          fieldInfo: [
            {
              fieldName: '省份',
              description: '省份名称',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '城市',
              description: '城市名称',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '房价',
              description: '一套房的总价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '楼盘',
              description: '楼盘名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '原价',
              description: '楼盘的原价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '现价',
              description: '楼盘的现价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '实际上，如果鹤岗化只是局限于教育领域，那还好说，但不是实际情况复杂的多楼市，像鹤岗那样房子白菜价的城市越来越多了，据不完全统计，至少有 10 个省 24 个城市陷入几万元买房的讨论。不是每平方米单价几万，而是一套房总价几万。网传广东惠州6万，广西南宁5万，山东东营4万，江苏南京3万，黑龙江大靶1万，这个传播势头在这轮楼市调整的加持下，现在已经来到了北京的外围，在京津两市的交界处，抹楼盘从 160 万元降到了 39 万，而且打了骨折还卖不出去。'
        },
        timeCost: '5.8'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '人口',
              description: '地区人口数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '编制人员数量',
              description: '编制内的工作人员数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '行政管理支出',
              description: '一年的行政管理支出',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '一般公共预算收入',
              description: '一般公共预算收入',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '工资预算总支出',
              description: '工资预算总支出',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '在职人员工资支出',
              description: '在职人员的工资支出',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '离退休人员工资支出',
              description: '离退休人员的工资支出',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '零聘人员工资支出',
              description: '零聘人员的工资支出',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '在职人员数量',
              description: '在职人员的数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '临聘人员数量',
              description: '临时聘用人员的数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '地方财力，之前鹤岗是全国第一个财政重整的地级市，甚至传出来停招公务员，现在过紧日子的城市也越来越多了。秦岭深处某县人口只有3万，编制人员却有 2, 194 名，一年的行政管理支出 1, 800 万，排在支出的首位。乌蒙山区某县一般公共预算收入 7 个亿，但工资预算总支出 26.3 亿，其中在职人员 20 亿，离退休人员 1.7 亿，零聘人员 4.6 亿。注意一个细节，在职人员数量 1.5 万，临聘人员数量 2.8 万。'
        },
        timeCost: '11.6'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '房价跌幅',
              description: '房价跌幅百分比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国房价一度被视为坚不可摧的资产堡垒，更一度有京沪永远涨的口号。然而，自 2021 年以来，包括一线城市在内，房价持续低迷，深圳全市二手房均价距离 2021 年初的最高点跌幅已接近40%，而且还没有停下来的意思。各热点城市二手房每成交一套就要多出好几套，新增的房源和房价表现几乎完全正相关的是飞天茅台的价格， 53 度。'
        },
        timeCost: '3.9'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格',
              description: '商品价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '飞天茅台在 2021 年巅峰时期，一瓶售价超过 3, 500 元，如今已经快跌破 2, 000 元，是巧合吗？过去一线城市房价和飞天茅台价格可以说是最硬的人民币计价资产了，甚至比现金还要优质。一线房产和飞天茅台在相当长的一段时间内有两个相同属性，一他们可以长期增值。二他们易于套现。然而现在情况出现了前所未有的变化，房价和飞天茅台两者双双在 2012 一年见顶。'
        },
        timeCost: '12.2'
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
              报价: null,
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
              报价: null,
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
              报价: null,
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
              报价: null,
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
              报价: null,
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
              报价: null,
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
              报价: null,
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
              报价: null,
              折扣: null
            },
            {
              年份: '2024',
              品牌: '保时捷',
              车型: '泰肯',
              区域: null,
              优惠金额: null,
              最低售价: null,
              裸车价: null,
              报价: 1038000,
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
              报价: null,
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
              报价: null,
              折扣: [70, 80]
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '品牌',
              description: '汽车品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '车型',
              description: '具体车型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '区域',
              description: '销售区域',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '优惠金额',
              description: '优惠金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '最低售价',
              description: '优惠后的最低售价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '裸车价',
              description: '裸车价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '报价',
              description: '原始报价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '折扣',
              description: '折扣比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '这不是巧合，其他很多数据也都在 2021 年见顶，比如另一个在 2021 年见顶并开始走下神坛的保时捷。保时捷销量的恶化还在加速，过去一年多，中国市场上保时捷的落地价可以说是惨不忍睹。近期，保时捷只卖 44 万的话题也引发了热议，其华南区域一家终端门店称， Macan 正在进行优惠促销，最高优惠 16 万，该车优惠后最低售价为 44.8 万。另外，在山东、湖北、江西、福建、浙江、江苏等多省份，该车均出现了 50 万元以下的裸车价，而报价达到 103.8 万的泰肯，现在 70 多万就可以拿下。目前，保时捷几乎所有的车型都可以打 7- 8 折。'
        },
        timeCost: '20.5'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间',
              description: '具体时间',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '销量',
              description: '汽车销量',
              type: 'count',
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
          text: '不只是保时捷，包括奔驰、宝马、奥迪在内的豪华汽车品牌今年以来都在大幅降价，但仍然止不住销量断崖式下降。 2024 年一季度，保时捷中国卖出 16, 340 辆，同比大幅下降24%。保时捷在今年 5 月份仅卖出 4, 633 辆，同比去年5月下滑高达40.61%。这说明保时捷在中国的销量正在加速减少。'
        },
        timeCost: '3.2'
      },
      {
        context: {
          dataTable: [
            {
              车型: '卡罗拉油电混动',
              国家: '中国',
              售价: 79800,
              时间: '2024'
            },
            {
              车型: '卡罗拉油电混动',
              国家: '中国',
              售价: 131800,
              时间: '2022'
            },
            {
              车型: '卡罗拉油电混动',
              国家: '美国',
              售价: 23500,
              时间: '2024'
            },
            {
              车型: '凯美瑞混动版',
              国家: '中国',
              售价: 149800,
              时间: '2022'
            }
          ],
          fieldInfo: [
            {
              fieldName: '车型',
              description: '汽车的型号',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '汽车售价所在的国家',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '售价',
              description: '汽车的售价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '时间',
              description: '数据对应的时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '从两年前开始，特斯拉的 3 和 y 中国售价就是世界最低的， 7.98 万可以买到原本指导价 13.18 万的油电混动的卡罗拉。做一个对比，美国的油电混动卡罗拉的起售价是 2.35 万美元，有时甚至还要加价。按照美元人民币汇率计算，这款车的中国售价居然只有美国的一半水平，尽管配置存在差异，但不影响价格差异巨大的这个结论。除了卡罗拉外，汉兰达和凯美瑞也都大幅降价，即使是两年前，我们也很难想象只要 14.98 万人民币就可以买到最新款的混动版凯美瑞。'
        },
        timeCost: '3.3'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '交通工具',
              description: '使用的交通工具',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格区间',
              description: '单程价格区间',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国物价的下降不仅仅体现在商品上，服务价格也是类似的趋势。举个例子，十多年前我常驻北京，当时经常在晚上十一二点从首都机场打车到西直门这样一段单程大约需要 110- 120 元，而现在滴滴大概只要 60- 70 元。如果是现在的出租车，价格和十多年前还是一样的。'
        },
        timeCost: '6.5'
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
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应年份',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '不良率',
              description: '个人住房贷款不良率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '以工行、农行、建行发布的数据来看，其 2023 年个人住房贷款不良率分别由 2022 年的0.39%、0.51%、 0.37% 增长至了0.44%、 0.55% 和0.42%，基本都实现了两位数的增幅。大家别觉得这些小数字没啥大不了的，要知道这三家银行每一家的个人住房贷款余额都超过了5万亿，而且按揭贷款往年基本上都是银行稳赚不赔的买卖。供建农三家银行之所以每年能够包揽中国最赚钱企业的前三名，按揭贷款所带来的收益贡献巨大。现在这个优质资产的不良率正在以每年两位数的增幅增加。'
        },
        timeCost: '11.6'
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
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '季度',
              description: '数据对应的季度',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '法拍房挂牌数量',
              description: '法拍房挂牌的数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '同比增长率',
              description: '法拍房挂牌数量同比增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '你是银行，你慌不慌？而另一项作为佐证的数据则是法拍房，大家知道现在法拍房的数据有多夸张吗？根据瀚海研究院发布的数据显示， 2022 年全国共挂牌法拍房 98 万套，去年这个数字变成了 141 万套，增长了43.9%。而今年光是一季度的挂牌数量就已飙升至 60.44 万套通，同比上涨192%。这种局势下，银行要是再不改变断供处置策略，那今年的法拍数量估计有望达到 200 万。'
        },
        timeCost: '5.7'
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
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '挂牌法拍房数量',
              description: '挂牌法拍房的数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '成交法拍房数量',
              description: '最终成交的法拍房数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '处置率',
              description: '法拍房的处置率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '事实上，对银行来说，现在的行情即使他收了房也难以处置。我们以北京为例， 2023 年北京挂牌法拍房 8, 153 套，最终成交仅 2, 771 套，处置率为33%，这还是房价波动相对较小的北京，换到其他已经跌穿首付的地区，处置率恐怕只会更低。而在法拍流程里，流拍和拍品二次上拍都会在此前的价格上更进一步降低，这也导致了银行回款难度的进一步提高。虽然按照现在的规则，这部分差价是由贷款人承担的，但对方既然已经到了选择断供的地步，可想而知最终也执行不了多少。'
        },
        timeCost: '5.1'
      },
      {
        context: {
          dataTable: [
            {
              日期: '2024-05',
              未出售商品房面积: 746000000,
              正常库存水平: 590000000
            },
            {
              统计时间段: '上半年',
              城市数量: 222,
              宽松政策数量: 341
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
              fieldName: '未出售商品房面积',
              description: '未出售商品房的总面积',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '正常库存水平',
              description: '正常情况下的库存水平',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '统计时间段',
              description: '统计数据的时间段',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '城市数量',
              description: '参与统计的城市数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '宽松政策数量',
              description: '出台的宽松政策数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '另一项推动银行改变策略的原因，则是今年4月 30 号的一场会议，这场会议确定了房地产行业未来一年的发展方向，统筹消化存量房产和优化增量住房，用大家都熟悉的话来说就是去库存。根据国家统计局的官方数据显示，截至 2024 年5月，我国未出售商品房为 7.46 亿平米，远超 5.9 亿平米的正常库存水平。而整个上半年，根据 CRS 的统计，全国 222 个城市总计出台了 341 项宽松政策，但带来的效果均不理想，无论是销售面积还是投资金额，仍然在持续走低。'
        },
        timeCost: '8.0'
      },
      {
        context: {
          dataTable: [
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
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '汽车出口量',
              description: '中国汽车出口的数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '大家好，我拍拍一名做过财经记者，大学老师和滴滴司届 up 主。 2023 年，我国汽车出口量达到了 491 万辆，超越日本成为世界第一汽车出口国。要知道，日本在这个位置坐了 8 年之久，而中国仅在过去三年时间里接连赶超韩国、德国、日本。中国汽车出口， 2021 年 202 万辆， 2022 年 311 万辆， 2023 年 491 万辆。'
        },
        timeCost: '3.0'
      },
      {
        context: {
          dataTable: [
            {
              车型: '名爵ZS',
              排名: 1,
              指导价: [80000, 90000]
            },
            {
              车型: '特斯拉 model y',
              排名: 2,
              指导价: null
            },
            {
              车型: '奇瑞瑞虎7',
              排名: 3,
              指导价: null
            },
            {
              车型: '特斯拉 model 3',
              排名: 4,
              指导价: null
            },
            {
              车型: '名爵 4 EV',
              排名: 5,
              指导价: null
            },
            {
              车型: '奇瑞虎5X',
              排名: 6,
              指导价: null
            },
            {
              车型: '欧盟达名爵5',
              排名: 7,
              指导价: null
            },
            {
              车型: '缤越元plus',
              排名: 8,
              指导价: null
            },
            {
              车型: '名爵 5',
              排名: null,
              指导价: 60000
            },
            {
              车型: '缤越',
              排名: null,
              指导价: 60000
            }
          ],
          fieldInfo: [
            {
              fieldName: '车型',
              description: '中国出口的乘用车车型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '排名',
              description: '车型在出口量中的排名',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '指导价',
              description: '车型的国内指导价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国汽车转眼间为何变得这么受欢迎呢？又到底是哪些国家在购买中国汽车？中国卖给老外汽车又是些什么品牌和价位车型？本期视频就为大家打开中国汽车出口全球第一背后的真实数据。首先，中国出口的 491 万辆汽车都是些什么车呢？根据乘联会统计，中国乘用车出口量前十车型分别为名爵ZS、特斯拉 model y、奇瑞瑞虎7、特斯拉 model 3、名爵 4 EV、奇瑞虎5X、欧盟达名爵5、缤越元plus。除了特斯拉的 model y 和 model 3，其他车型国内指导价基本都在 10 万元左右，比如排名第一的名爵ZS，指导价 8- 9万元，最便宜的名爵 5 和缤越低到6万元就能拿下，可见中国汽车出海主打的还是一个性价比。'
        },
        timeCost: '10.8'
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
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '汽车类型',
              description: '燃油车或新能源汽车',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '出口数量',
              description: '汽车出口数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源车出口占比',
              description: '新能源汽车占出口总量的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源车出口增速',
              description: '新能源汽车出口的增长速度',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '如果按燃油车、新能源车的分类来看， 2013 年中国出口燃油车 371 万辆，出口新能源汽车 120 万辆，新能源车占到出口总量的25%，虽然这个占比目前只有 1/ 4，但去年新能源出口增速是77.6%，势头不可谓不猛。'
        },
        timeCost: '6.6'
      },
      {
        context: {
          dataTable: [
            {
              国家: '俄罗斯',
              年份: 2013,
              出口量: 909000
            },
            {
              国家: '墨西哥',
              年份: 2013,
              出口量: 415000
            },
            {
              国家: '比利时',
              年份: 2013,
              出口量: 217000
            },
            {
              国家: '澳大利亚',
              年份: 2013,
              出口量: 214000
            },
            {
              国家: '英国',
              年份: 2013,
              出口量: 214000
            },
            {
              国家: '沙特阿拉伯',
              年份: 2013,
              出口量: 213000
            },
            {
              国家: '菲律宾',
              年份: 2013,
              出口量: 172000
            },
            {
              国家: '泰国',
              年份: 2013,
              出口量: 169000
            },
            {
              国家: '阿联酋',
              年份: 2013,
              出口量: 159000
            },
            {
              国家: '西班牙',
              年份: 2013,
              出口量: 139000
            },
            {
              地区: '欧洲',
              年份: 2013,
              占比: 38
            }
          ],
          fieldInfo: [
            {
              fieldName: '国家',
              description: '汽车出口的国家',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应的年份',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '出口量',
              description: '汽车出口量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '地区',
              description: '按地区划分的市场',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '占比',
              description: '地区占中国汽车对外出口的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '那中国汽车出口都卖到了哪些国家呢？ 2013 年中国汽车出口量前十的国家分别是，俄罗斯90.9万辆，墨西哥 41.5 万辆，比利时 21.7 万辆，澳大利亚 21.4 万辆，英国 21.4 万辆，沙特阿拉伯 21.3 万辆，菲律宾 17.2 万辆，泰国 16.9 万辆，阿联酋 15.9 万辆，西班牙 13.9 万辆。按地区来看的话，欧洲市场占中国汽车对外出口的38%，远超其他任何单一大洲，可见中国汽车正在得到全世界更多人的认可。'
        },
        timeCost: '8.2'
      },
      {
        context: {
          dataTable: [
            {
              年份: '2023',
              国家: '俄罗斯',
              汽车出口量: 909000,
              出口量增长率: 468
            },
            {
              年份: '2023',
              国家: '俄罗斯',
              品牌: '奇瑞金车',
              市场占有率: 11.2
            },
            {
              年份: '2023',
              国家: '俄罗斯',
              品牌: '哈弗',
              市场占有率: 10.6
            },
            {
              年份: '2023',
              国家: '俄罗斯',
              新车市场占比: 51
            },
            {
              年份: '2023',
              国家: '俄罗斯',
              出口增量贡献率: 42
            },
            {
              年份: '2024',
              国家: '俄罗斯',
              预测新车市场占比: 80
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
              fieldName: '国家',
              description: '国家名称',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '汽车出口量',
              description: '中国对该国的汽车出口量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口量增长率',
              description: '中国对该国的汽车出口量增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '品牌',
              description: '汽车品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场占有率',
              description: '品牌在市场中的占有率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新车市场占比',
              description: '中国汽车在俄罗斯新车市场的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口增量贡献率',
              description: '俄罗斯对中国汽车出口增量的贡献率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '预测新车市场占比',
              description: '预测中国汽车在俄罗斯新车市场的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然了，中国汽车出口世界第一，又不得不提议俄罗斯和墨西哥这两个国家可以说去年是把中国车买爆了。 203 年，中国对俄罗斯的汽车出口量从上一年度的 16 万辆暴增到了90.9万辆，增加了468%。在俄罗斯的新车市场中，第一名是俄罗斯品牌拉达，第二至第七名则全都是中国品牌，比如第二名是奇瑞金车，市场占有率11.2%。第三名是哈弗，新车，市场占有率10.6%。俄罗斯卖最好的新能源车也是来自中国的极客。目前中国汽车已经占据俄罗斯新车市场的51%，可以说是拿下了半壁江山。而对于中国而言，仅俄罗斯一个国家 203 年就贡献了中国汽车出口增量的42%，甚至有俄罗斯本土汽车经销商预测， 2024 年中国汽车可能占据俄罗斯新车份额的80%。'
        },
        timeCost: '14.4'
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
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '国家名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额',
              description: '国家在俄罗斯新车市场的份额',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '有人说俄罗斯满爆中国汽车是因为欧美的贸易封锁，这也步无道理。 2013 年在俄罗斯的新车市场中，欧洲的市场份额从 18% 降到了4%，韩国从 16% 降到了6%，日本从 12% 降到了5%，和欧日韩都是对俄罗斯实行了限制出口国家，其中就包括了部分汽车，可以说中国汽车吃下的正是欧日韩在俄罗斯丢掉市场。'
        },
        timeCost: '3.8'
      },
      {
        context: {
          dataTable: [
            {
              国家: '墨西哥',
              年份: '2013',
              中国汽车占比: 25,
              品牌: null,
              销量: null,
              新能源汽车占比: null
            },
            {
              国家: '墨西哥',
              年份: '2007',
              中国汽车占比: 0,
              品牌: null,
              销量: null,
              新能源汽车占比: null
            },
            {
              国家: '澳大利亚',
              年份: '2023',
              中国汽车占比: null,
              品牌: '名爵',
              销量: 58000,
              新能源汽车占比: null
            },
            {
              国家: '澳大利亚',
              年份: '2023',
              中国汽车占比: null,
              品牌: '比亚迪',
              销量: null,
              新能源汽车占比: 14
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
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '中国汽车占比',
              description: '中国汽车在该国销售汽车中的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '品牌',
              description: '汽车品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '销量',
              description: '汽车销量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源汽车占比',
              description: '中国新能源汽车在该国市场中的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然了，除了俄罗斯之外，其他国家也在买中国汽车，比如墨西哥。 2013 年，墨西哥所有销售汽车中有 25% 来自中国，而在 6 年前这个数字为0。澳大利亚也在不断买中国汽车，最受澳大利亚欢迎的中国汽车品牌是名爵，去年卖了 5.8 万辆。在新能源车市场，比亚迪则占据了澳大利亚的新能源汽车 14% 份额，位于第二名。'
        },
        timeCost: '7.1'
      },
      {
        context: {
          dataTable: [
            {
              公司: '特斯拉',
              市场: '全球',
              年份: null,
              市场份额: 53,
              销量: null,
              出口国家和地区数量: null,
              出口汽车数量: null,
              出口汽车数量同比: null,
              平均出口价格: null
            },
            {
              公司: '中国车企',
              市场: '东南亚',
              年份: 2013,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              出口汽车数量: null,
              出口汽车数量同比: null,
              平均出口价格: null
            },
            {
              公司: '中国品牌',
              市场: '泰国',
              年份: null,
              市场份额: 80,
              销量: null,
              出口国家和地区数量: null,
              出口汽车数量: null,
              出口汽车数量同比: null,
              平均出口价格: null
            },
            {
              公司: '比亚迪',
              市场: '泰国',
              年份: null,
              市场份额: 40,
              销量: null,
              出口国家和地区数量: null,
              出口汽车数量: null,
              出口汽车数量同比: null,
              平均出口价格: null
            },
            {
              公司: '比亚迪',
              市场: '全球',
              年份: 2023,
              市场份额: null,
              销量: null,
              出口国家和地区数量: 58,
              出口汽车数量: 240000,
              出口汽车数量同比: 234,
              平均出口价格: null
            },
            {
              公司: '中国新能源汽车',
              市场: '全球',
              年份: 2019,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              出口汽车数量: null,
              出口汽车数量同比: null,
              平均出口价格: 5000
            },
            {
              公司: '中国新能源汽车',
              市场: '全球',
              年份: 2022,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              出口汽车数量: null,
              出口汽车数量同比: null,
              平均出口价格: 22000
            },
            {
              公司: '比亚迪',
              市场: '欧洲',
              年份: null,
              市场份额: null,
              销量: null,
              出口国家和地区数量: null,
              出口汽车数量: null,
              出口汽车数量同比: null,
              平均出口价格: 500000
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
              fieldName: '市场',
              description: '市场区域',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额',
              description: '市场份额占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '销量',
              description: '销量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口国家和地区数量',
              description: '出口国家和地区数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口汽车数量',
              description: '出口汽车数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口汽车数量同比',
              description: '出口汽车数量同比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '平均出口价格',
              description: '平均出口价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然，这里也不得不提一下第一名，那就是特斯拉市场份额高达53%，在东南亚市场，中国车企业销量在 2013 年同样实现小幅上升，最典型的就是泰国，在泰国的新能源车市场，中国品牌占据了 80% 的份额，比如比亚迪的原 plus 就是泰国的新能源车爆款，那到底是什么原因让中国汽车爆卖呢？基本还可以总结为三方面原因，首先是全球疫情爆发，由于中国汽车的供应链完善，疫情期间仍能维持稳定生产，而日韩这些过去的出口大户受疫情影响，芯片、钢材、橡胶等关键原材料短缺，不仅汽车产能下降，而且成本升高，这就让中国汽车更具性价比。而随着中国国内新能源汽车市场越来越卷出海，成为不少中国车企的选择，比如比亚迪 2023 年进入全球 58 个国家和地区，出口汽车 24 万辆，是上一年度的 3.34 倍。在泰国新能源车市场，比亚迪单独占到了 40% 的市场份额，是名副其实的泰国新能源汽车销冠。而且中国新能源汽车并非只是具备成本优势，汽车与 AI 互联网融合的智能化更是中国车企的拿手好戏。从豪华配置到智能大屏，从外观设计到内饰比拼，这让中国新能源汽车的溢价能力明显变高。2019 年中国新能源汽车平均出口价格每量只有 5, 000 美元， 2022 年涨到了 2.2 万美元。比如比亚迪汉在欧洲发布时价格接近 50 万人民币，是国内售价的两倍多。在泰国、以色列、新西兰等多个国家，比亚迪也已经是新能源汽车的销售冠军。不过，中国汽车征服海外虽然是一部励志爽门，但其实有不少挑战。'
        },
        timeCost: '12.4'
      },
      {
        context: {
          dataTable: [
            {
              年份: '2000',
              国家: '越南',
              摩托车品牌: '中国',
              市场份额: 80
            },
            {
              年份: '2024',
              国家: '越南',
              摩托车品牌: '日本',
              市场份额: 95
            },
            {
              年份: '2024',
              国家: '越南',
              摩托车品牌: '中国',
              市场份额: 1
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '市场所在国家',
              type: 'region',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '摩托车品牌',
              description: '摩托车品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额',
              description: '摩托车品牌在市场中的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '其实中国汽车出海不禁让人想起曾经的中国摩托车出海。 2000 年前后，中国摩托车进军越南，一度占据了 80% 的越南市场份额，但不到三四年时间，却被日本摩托车打得片甲不留。如今日本摩托车在越南占据 95% 的份额，而中国摩托车百分之一都不到。曾经也有大量中国摩托车车企在越南建厂，但却形成了恶性竞争的关系，疯狂打价格战，导致服务和质量越来越差，越南的中国摩托车车企仿佛是飘在越南的。'
        },
        timeCost: '4.5'
      },
      {
        context: {
          dataTable: [
            {
              企业名称: '汇川技术',
              企业规模: null,
              企业数量: null,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: '恒力液压',
              企业规模: null,
              企业数量: null,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: '先导智能',
              企业规模: null,
              企业数量: null,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: '顺域光学',
              企业规模: null,
              企业数量: null,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: '军胜电子',
              企业规模: null,
              企业数量: null,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: null,
              企业规模: '规模以上',
              企业数量: 445000,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: null,
              企业规模: '存续',
              企业数量: 6220000,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: null,
              企业规模: '规模以下',
              企业数量: 4000000,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: null
            },
            {
              企业名称: null,
              企业规模: null,
              企业数量: null,
              工厂规模: '不到50人',
              工厂占比: 40,
              工厂人数: [0, 50],
              年产值: null
            },
            {
              企业名称: null,
              企业规模: null,
              企业数量: null,
              工厂规模: '不到500人',
              工厂占比: 90,
              工厂人数: [0, 500],
              年产值: null
            },
            {
              企业名称: null,
              企业规模: null,
              企业数量: null,
              工厂规模: null,
              工厂占比: null,
              工厂人数: null,
              年产值: [1000000, 10000000]
            }
          ],
          fieldInfo: [
            {
              fieldName: '企业名称',
              description: '零部件供应商企业名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '企业规模',
              description: '企业规模分类',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '企业数量',
              description: '企业数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '工厂规模',
              description: '工厂规模分类',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '工厂占比',
              description: '工厂规模占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '工厂人数',
              description: '工厂人数范围',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '年产值',
              description: '工厂年产值范围',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '每个中国制造品牌的背后都有一批优秀的零部件供应商，像汇川技术、恒力液压、先导智能、顺域光学、军胜电子这样的零部件企业也是中国制造的骄傲，只不过知名度无法媲美消费者直接接触的终端品牌。按照官方的口径，中国规模以上也就是年销售收入 2, 000 万以上的制造企业有 44.5 万家。至于中国一共有多少家制造业企业存在各种口径，从 300 多万家到近千万家不等。万德资讯给我的数据是，中国大约有 622 万家存续的制造业企业。海之在线是一家总部在上海，聚焦中间品贸易的数字化平台，连接着 70 万家工厂，他们给我的数据是，中国规模以下的中小微工厂大致有 400 万家。这期节目标题中的 400 万家沉默工厂处处记载于此。海志在线的创始人、 CEO 佘莹对我说，从平台看， 40% 的工厂规模不到 50 人，近 90% 的工厂不到 500 人，大部分工厂的年产值在数百万元到数千万元。如果和大企业比，你可以说他们就是一个个的小做法。如果走进去可能会看到老旧的机器上油漆斑驳，可以看到生产计划就用记号笔写在车间墙上挂着的白板上，甚至会发现用破洞的木板随意围搭起来的厕所，待客的茶水里则混杂着浓浓的机油味。但他们就是中国制造业毛细血管层面的供应链小节点，勤勤恳恳的维护设备、搞生产，他们最在意的是生存，是接到订单以及在满足客户之后能够完整的收到货款。'
        },
        timeCost: '9.7'
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
              指标: '开发商银行贷款',
              同比变化: 19
            },
            {
              月份: '5月',
              指标: '房贷和存款跟预付款的比例',
              同比变化: [-40, -30]
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
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '金属类型',
              description: '金属的种类',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '产量变化',
              description: '金属产量的变化',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '月份',
              description: '具体月份',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '指标',
              description: '具体指标',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '同比变化',
              description: '同比变化的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '预测年份',
              description: '预测的年份',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '贷款增加',
              description: '贷款增加的金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '有报道称，一些地方政府面临收入短缺，要求企业缴纳可追溯到 1990 年代的税单。这种紧缩政策在房地产市场寻找几步的时刻，会损害上信心和经济。高盛认为，中国中央政府可以通过加大对西方政府的财政支持来切断机房政府无紧缩所出现的负面溢出效应，那如同美国监管机构在次贷危机期间通过成为最后贷款人来切断金融危机的传播一样。关于出口和机产之间的分化，可以同中国的金属生产中得到证实啊。铝和其他废且金属的产量相比疫情之前上升了 20% 以上，而钢铁的产量下降了 5% 到10%。在房产方面，开发商越来越依赖银行融资， 5 月份对开发商的银行贷款同比增长了19%。而随着房地产销售的下滑，房贷和存款跟预付款的比例同比下降了 30% 到40%。高盛银行股票团队预计从 2024 年到 2026 年，房地产贷款将增加 4.5 万亿人民币，以完全期待收缩的房地产债券和设防的影子银行贷款。'
        },
        timeCost: '6.4'
      },
      {
        context: {
          dataTable: [
            {
              投资类型: '燃气和水的生产投资',
              增长情况: 100
            },
            {
              投资类型: '整体基建投资',
              增长情况: null
            },
            {
              销售类型: '代线销售商品',
              月份: '5月',
              同比增长: 13
            },
            {
              销售类型: '餐饮销售',
              月份: '5月',
              同比增长: 5
            },
            {
              销售类型: '线下商品销售',
              月份: '5月',
              同比增长: 0
            }
          ],
          fieldInfo: [
            {
              fieldName: '投资类型',
              description: '具体的投资类型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '增长情况',
              description: '投资增长情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '销售类型',
              description: '具体的销售类型',
              type: 'string',
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
              fieldName: '同比增长',
              description: '销售同比增长情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国经济分化并不止于出口和房地产基础设施的固定资产投资。细分项显示，建立燃气和水的生产投资已同疫情前水平翻倍，远远超过了整体的基建的投资增长。因为中国政府首先优先考虑农源供用安全和脱碳。在零售销售当中， 5 月份代线销售商品同比增长13%，而餐饮销售仅增长5%，线下商品的销售保持在去年同期的水平。'
        },
        timeCost: '4.5'
      },
      {
        context: {
          dataTable: [
            {
              季度: '一季度',
              同比增长率: 5.3
            },
            {
              季度: 'G2 季度',
              同比增长率: 5
            }
          ],
          fieldInfo: [
            {
              fieldName: '季度',
              description: '具体季度',
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
          text: '7月中旬将举行两场重要的政策会议，前者将专注于评估当前的经济状况，并为今年剩余时间制定周期性的政策安排。后者将专注于至少未来五年解决经济结构当中的重大改革议程。鉴于一季度的实际， g GPT 同比增长5.3%，而且去年基数较低，那么 G2 季度增长可能高于5%，政府的全年增长目标仍然在轨道上。'
        },
        timeCost: '1.8'
      },
      {
        context: {
          dataTable: [
            {
              月份: '5月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: '6月19号',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: '7月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: '3月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: '4月',
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: null,
              季度: '三季度',
              降息幅度: 25,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: '9月',
              季度: '四季度',
              降息幅度: 10,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: 11.9,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: 11.2,
              信贷增长率: null,
              美元兑人民币汇率: null
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: 9,
              美元兑人民币汇率: null
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: 9.5,
              美元兑人民币汇率: null
            },
            {
              月份: null,
              季度: null,
              降息幅度: null,
              财政赤字占GDP比例: null,
              信贷增长率: null,
              美元兑人民币汇率: 7.3
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
              fieldName: '季度',
              description: '具体季度',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '降息幅度',
              description: '降息的基点数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '财政赤字占GDP比例',
              description: '财政赤字占GDP的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '信贷增长率',
              description: '信贷增长率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '美元兑人民币汇率',
              description: '美元兑人民币汇率',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '高盛认为，政策执行者不会在 7 月份的首场会议上释放任何重大的刺激措施，宏观政策的证件可能大于维持当前立场和执行现有的政策。另一方面，鉴于 5 月份宣布的最后一批措施不及预期，可能存在引入更多期产宽松政策的可能性。在货币政策方面，资本外流的担忧和银行利润率的下降限制了央行降息的能力。高盛预计三季度将降息 25 个基减，以适应大量政府债券发行，并预计季四季度9月首次降息后会再降息 10 个期减。在财政政策方面，高盛预计政府债券的发行将在下半年显著增加，以完成年初发行缓慢的全年配额。除非增长急剧放缓，否则基建的投资不会加速太多。对于政府 3 月份公布的预算计划，高盛虽然预测中国的增强型的弹盛赤字从去年的 gdp 11.2% 会适度扩大到今年的11.9%，但由于今年出口强计可能会存在财政扩张不及预期的风险。信贷政策方面，正如央行行长6月 19 号陆家嘴论坛上所说，由于金融套利的虚假贷款和监管机构随后对金融系统中这种资金空转的打击，信贷增长与 GDP 增长之间的联系已经减弱。预计摄容总量的增长将同去年的 9.5% 放缓到今年的9%。在住房政策方面，4月的政治局会议表明，决策者希望严防房地产市场的尾部风险。由于地产价格和活动的持续下行，以及机房国企通过央行的贷款计划购买空池公寓的速度缓慢，高盛预计进一步削减房贷利率以刺激需求，同时为去库存提供更多的资金和效率的支持。在外汇政策方面，鉴于美元持续强势和资本外流的压力，高盛认为央行将在短期内保持美元对人民币汇率的稳定，三个月的高盛预测是7.3，因为外汇市决策者可以迎来抵消关税对出口负面影响的工具。 2018- 19 年的经验表明，如果特朗普赢得美国大选，而且正如他最近几个月所宣称的，会对中国实施正大的关税，那美元兑人民币可能会显著贬值。'
        },
        timeCost: '11.6'
      }
    ]
  },
  {
    llm: 'doubao-pro-128k',
    result: [
      {
        context: {
          dataTable: [
            {
              党派: '左翼联盟',
              席位: 182
            },
            {
              党派: '新人民战线执政党中间派联盟',
              席位: 168
            },
            {
              党派: '极右翼国民联盟',
              席位: 143
            },
            {
              党派: '右翼共和党',
              席位: 48
            }
          ],
          fieldInfo: [
            {
              fieldName: '党派',
              description: '参与法国议会选举的党派',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '席位',
              description: '该党派在法国议会选举中获得的席位数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '议题',
              description: '法国议会选举中的相关议题',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '地图带你看懂法国大选。 2024 年法国议会选举结果揭示了法国社会的撕裂，没有任何党派能获得 577 个议题中的绝对多数。左翼联盟、新人民战线执政党中间派联盟和极右翼国民联盟分别占据 182 席、 168 席、 143 席。除了这三家以外，其余党派席位最多的也只有右翼共和党的 48 席，因此左翼联盟、执政党和极右翼算是形成了三分天下的格局。今天我们便结合地图和数据，聊一聊法国大选。本期视频的所有分析均为个人观点，仅供参考。在开始之前，我先快速的放一下各党派在几个主要政治议题上的立场，有需要的朋友可以截图保存一下。'
        },
        timeCost: '5.3'
      },
      {
        context: {
          dataTable: [
            {
              国家: '法国',
              选区数量: 577,
              每个选区人口数量范围: '10 - 12 万',
              城市: '巴黎、里昂、马赛',
              选区分布情况: '人口密集的大城市选区数量多，占比大'
            }
          ],
          fieldInfo: [
            {
              fieldName: '国家',
              description: '涉及的国家',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '选区数量',
              description: '该国的选区总数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '每个选区人口数量范围',
              description: '每个选区包含的人口数量范围',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '城市',
              description: '人口密集的大城市',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '选区分布情况',
              description: '选区在不同城市的分布情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '现在我们进入正题，首先需要说明法国的选区制度，全国共有 577 个选区，每个选区包括 10- 12 万的人口密集的地方选区就小，人口稀少的区域选区域就大。因此地图上各个政党所占的面积并不能与其票数划等号，而是要看具体的选区分布在人口密集的大城市，譬如巴黎、里昂、马赛，虽然看起来面积小，实际上选区数量很多，占的比重很大。'
        },
        timeCost: '7.4'
      },
      {
        context: {
          dataTable: [
            {
              势力: '左翼联盟新人民战线',
              席位数量: 182,
              地区: '大城市',
              年份: 2024,
              失业率省份排名范围: null,
              移民情况: null
            },
            {
              势力: '马克龙的执政党中间派联盟',
              席位数量: 168,
              地区: '大城市和西北地区',
              年份: 2024,
              失业率省份排名范围: null,
              移民情况: null
            },
            {
              势力: '极右翼国民联盟',
              席位数量: 143,
              地区: '东北与东南地区',
              年份: 2024,
              失业率省份排名范围: null,
              移民情况: null
            },
            {
              势力: '右翼共和党',
              席位数量: 48,
              地区: '经济富足且政治观点保守的地区',
              年份: 2024,
              失业率省份排名范围: null,
              移民情况: null
            },
            {
              势力: '法国西北地区',
              席位数量: null,
              地区: '西北地区',
              年份: 2024,
              失业率省份排名范围: '20个省失业率最低，21 - 40低的省份',
              移民情况: '大城市少，离地中海远，接受移民少'
            }
          ],
          fieldInfo: [
            {
              fieldName: '势力',
              description: '政治势力名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '席位数量',
              description: '获得的席位数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '地区',
              description: '势力的主要分布地区',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '失业率省份排名范围',
              description: '失业率在省份中的排名范围',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '移民情况',
              description: '该地区的移民情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '尽管如此，马克龙强调市场自由化，支持创新和创业，对欧盟一体化和国际合作的开放还是得到了许多大城市选民的支持。大城市仍然是马克龙的重要支持来源。除了大城市外，我们刚才提到过法国东北地区工业的衰落，其实在法国的西北地区又是另一番景象。之前那张关于中小工业城市分布的途中，我们可以清晰的看到西北地区的工业对于当代法国的重要性，当然工业只是一个缩影。我们再来看失业率地图，黄色代表 2022 年失业率最低的 20 个省，橙色是 21- 40 低的省份，可以看出西北部地区的失业率明显低于东北部。再看移民分布地图，西北部地区因为大城市少，而且离地中海更远，接受的移民也比较少。综上，西北地区的经济较为稳定，而且不受移民带来的社会问题困扰，日子过得比较舒服，这些选民对于未来持乐观态度，也成为了马克龙的另一主要票仓。除了以上三大势力外，浅蓝色代表的右翼共和党也获得了 48 个席位。他们的支持者主要位于经济同样比较富足，但是政治观点更为保守的地区。这里我就不展开讲总结。本期视频我们从法国官方的报告与数据出发，从经济与人口地理的角度分析了法国的大选结果。左翼联盟新人民战线以大城市为根基拿下最多的 182 席，马克龙的执政党中间派联盟则凭借大城市和西北地区的支持者取得了 168 席。乐旁的极右翼国民联盟则主要扎根于东北与东南地区，以 143 起居于第三这样的三分割据局面使得法国议会缺乏绝对多数，并且三方势力相差不大。可以预见在未来法案的通过上会面临极大的阻碍。举例来说，左翼和极右翼甚至存在联手撤回延迟退休法案的理论可能。虽然实际操作起来也面临很多困难，双方都不太愿意和对方合作，但即便是理论，可能也已经能表明未来的不确定性。'
        },
        timeCost: '11.0'
      },
      {
        context: {
          dataTable: [
            {
              品牌: '星巴克',
              财报季度: '第二季度',
              营业收入: 8560000000,
              营业收入同比变化: -2,
              净利润变化: -15,
              股票市值蒸发金额: 11500000000,
              优惠券数量: 5,
              咖啡单品团购价: 9
            }
          ],
          fieldInfo: [
            {
              fieldName: '品牌',
              description: '咖啡品牌名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '财报季度',
              description: '公布财报的季度',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '营业收入',
              description: '公司的营业总收入',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '营业收入同比变化',
              description: '营业收入与上年同期相比的变化情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '净利润变化',
              description: '净利润的变化情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '股票市值蒸发金额',
              description: '股票市值减少的金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '优惠券数量',
              description: '手机APP收到的优惠券数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '咖啡单品团购价',
              description: '部分咖啡单品的团购价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '住手，你们住手，不要再砸了，你们不要再砸了。万万没想到，瑞幸和库迪的九块九大战，快把星巴克给卷死了。前段时间，星巴克公布了第二季度财报，营业收入 85.6 亿美元，同比下降了2%，净利润大跌15%，股票市值一天内蒸发了 1, 150 亿人民币。另一方面，星巴克的咖啡也在悄悄降价。如果你手机上有星巴克的APP，几乎每天都会收到 5 张以上的优惠券，比如满60.10、满75.15、任意新冰乐 7 折等等，部分单品的团购价优惠下来低至 9 元。终于， 9.9 的风还是卷到了星巴克。在过去很长一段时间里，星巴克是小资生活的代表，一杯咖啡动辄几十块钱，也只有电视剧里那些白领们和云淡风轻的走进去，熟练地点一杯拿铁，找个位置坐下，悠闲地打开电脑喝咖啡。岁月静好人间，值得有人点一杯星巴克，朋友圈能发十几条动态，有人为了抢星巴克限量版的猫爪杯，能通宵排队，甚至大打出手。'
        },
        timeCost: '22.3'
      },
      {
        context: {
          dataTable: [
            {
              地区: '美国',
              咖啡价格: 2.95,
              平均月工资: 6228,
              最低时薪: 7.25,
              主力消费人群月薪: null
            },
            {
              地区: '中国',
              咖啡价格: 30,
              平均月工资: null,
              最低时薪: null,
              主力消费人群月薪: 60000
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '咖啡品牌所在地区',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '咖啡价格',
              description: '一杯咖啡的价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '平均月工资',
              description: '该地区的平均月工资',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '最低时薪',
              description: '该地区的最低时薪',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '主力消费人群月薪',
              description: '该地区该品牌主力消费人群的月薪',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '星巴克在中国国内的定位一直都是高端咖啡品牌，但是很多人不知道的是，它在国外的定位其实是平民咖啡，在美国一杯星巴克大杯美式咖啡大概是 2.95 美元，而根据美国劳工部的统计，美国平均月工资是 6, 228 美元，最低时薪是 7.25 美元，这是啥意思呢？ 1002.65 美元的星巴克还不到美国人平均月收入的 2, 000 份之一，也就是平常坐一趟地铁的价格吧。而在中国市场，星巴克的饮品价格普遍要超过 30 元一杯。如果按照美国的对应消费力，它的主力消费人群应该是月薪至少6万元的人。'
        },
        timeCost: '8.3'
      },
      {
        context: {
          dataTable: [
            {
              时间: '2019-02',
              产品: '粉爪杯',
              售价: 199,
              网上炒价: 1800
            }
          ],
          fieldInfo: [
            {
              fieldName: '时间',
              description: '事件发生的时间',
              type: 'date',
              dateGranularity: 'year-month',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '产品',
              description: '发售的物品',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '售价',
              description: '产品的销售价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '网上炒价',
              description: '产品在网上被炒作的价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '2019 年2月，星巴克就发售了一款粉爪杯，那它长这样？售价 199 元，但是在网上最高炒到了 1, 800 元。有人寒冬腊月在星巴克门口通宵排队，就是为了买到这么一个杯子。还有人因为排队顺序大打出手，最后喜提免费食宿。靠着这些营销方法，在很长一段时间里，普通人对于星巴克是仰望的，觉得去星巴克消费是很有品的，再往前推十年，你甚至可以看到有人去星巴克点一杯咖啡就可以发十几条朋友圈的各种角度各种场景，还要配文低调有实力，天天喝都喝腻了好像呢？甚至有人专门发帖认真的提问，第一次去星巴克主要注意什么？怎么装的像老手呢？我一开始还以为是来搞笑和反讽的，没想到点开帖子此还真的是教大家怎么去星巴克抓老手的，包括但不限于怎么下载APP，问店员这周用的是啥肚子萃取时间是多少？张度和烘焙度怎么样？要不要加糖和加奶？这唬得我一愣一愣的，但是时过境迁，如今星巴克已经支棱不起来了，一边是疯狂降价买三送一搞促销，一边是继续下沉到四五线城市。'
        },
        timeCost: '5.0'
      },
      {
        context: {
          dataTable: [
            {
              公司: '星巴克',
              年份: '2025',
              市场级别: 'd 级',
              市场数量: 300
            },
            {
              公司: '星巴克',
              年份: '2025',
              市场级别: '县域',
              市场数量: 3000
            },
            {
              公司: '星巴克',
              年份: '2025',
              门店数量: 7000
            }
          ],
          fieldInfo: [
            {
              fieldName: '公司',
              description: '发布战略愿景的公司名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '战略愿景发布的年份',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场级别',
              description: '市场的等级划分',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场数量',
              description: '对应市场级别的数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '门店数量',
              description: '公司在中国的门店总数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '星巴克近期发布的 2025 中国战略愿景当中，中国总部直言不讳地表示，星巴克看中的不仅仅是全国 300 多个 d 级市场，也包括近 3, 000 个县域市场。星巴克的愿景也体现在它的选址变化上，它在中国的门店已经突破了 7, 000 家，但是这开店位置却让人越来越看不懂了。'
        },
        timeCost: '6.4'
      },
      {
        context: {
          dataTable: [
            {
              咖啡店: '星巴克',
              咖啡价格: 30
            },
            {
              咖啡店: '瑞幸库里',
              咖啡价格: 9.9
            },
            {
              咖啡店: '瑞幸库里',
              咖啡价格: 9.9
            }
          ],
          fieldInfo: [
            {
              fieldName: '咖啡店',
              description: '咖啡品牌名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '咖啡价格',
              description: '咖啡的售价',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '一家卖咖啡的店。星巴克没落的第二个原因是当代年轻人更偏向实用消费主义。坦白讲，大部分人喝咖啡其实就是为了遮住那点咖啡因，好让自己在一天的工作中保持清醒。你跟不懂咖啡的人聊什么豆子产地、风味，他只会回你一句，冰美式和中药有什么区别啊？如果你面前有三杯咖啡，第一杯是星巴克的 30 元美式，后面两杯是瑞幸库里的 9 块 9 咖啡也让你买单，大部分人都会选择后面两个，当然也有人会吹星巴克的豆子有多么多么的好，所以它买的这么贵也是值得的。'
        },
        timeCost: '3.7'
      },
      {
        context: {
          dataTable: [
            {
              时间: '6月',
              指标: 'M2',
              '同比增长/下滑': 6.2
            },
            {
              时间: '6月',
              指标: 'M1',
              '同比增长/下滑': -5
            },
            {
              时间: '6月',
              指标: 'M2-M1 剪刀差',
              '同比增长/下滑': 11.2
            },
            {
              时间: '6月',
              人民币存款增加额: 2460000000000
            },
            {
              时间: '6月',
              居民存款增加额: 2140000000000
            },
            {
              时间: '上半年',
              指标: '人民币存款',
              '同比增长/下滑': null,
              人民币存款增加额: 11460000000000,
              居民存款增加额: 9270000000000
            }
          ],
          fieldInfo: [
            {
              fieldName: '时间',
              description: '数据对应的月份',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '指标',
              description: '货币相关指标',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '同比增长/下滑',
              description: '同比增长或下滑的数值',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '人民币存款增加额',
              description: '人民币存款增加的金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '居民存款增加额',
              description: '居民存款增加的金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '咱聊一下最新的重磅数据，反正挺复杂的，国内6月 M2 同比增长6.2%，预期6.8%。 M1 同比下滑5%，预期下滑5.4%。 M M 一剪刀差走扩至 11.2% 再创新高。6月人民币存款增加 2.46 万亿，其中居民存款增加 2.14 万亿，增量几乎全都是老百姓存的。与 M1 的下滑相对，上半年人民币存款总共增加了 11.46 万亿，其中居民存款增加 9.27 万亿。大头也是老百姓，但增速逐月放缓。'
        },
        timeCost: '8.9'
      },
      {
        context: {
          dataTable: [
            {
              日期: '2024-07-11',
              事件: '美国公布CPI数据超预期回落，市场对美联储降息预期大幅升温',
              议息会议时间: '2024-07-31',
              市场预期降息概率: 0.07
            },
            {
              日期: '2024-07-11',
              事件: '美国公布CPI数据超预期回落，市场对美联储降息预期大幅升温',
              议息会议时间: '2024-09-18',
              市场预期降息概率: 0.9
            },
            {
              日期: '2024-07-10',
              事件: '鲍威尔在国会听证会上发表讲话',
              议息会议时间: null,
              市场预期降息概率: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '日期',
              description: '事件发生的具体日期',
              type: 'date',
              dateGranularity: 'day',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '事件',
              description: '与美联储相关的事件描述',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '议息会议时间',
              description: '美联储议息会议的时间',
              type: 'date',
              dateGranularity: 'day',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场预期降息概率',
              description: '市场对美联储降息的预期概率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '7月 11 日晚上，由于美国公布的 CPI 数据超预期回落，让市场对美联储降息预期大幅升温。从这场所的美联储观察工具看，虽然7月 30 一日的美联储议息会议，市场预期不降息的概率仍然是达到93%，但9月 18 日的美联储议息会议，市场预期降息一次的概率是达到90%，这比起上个月概率是上升很多。不过我还是得强调一下，这个美联储观察工具将来只能反映市场当前的预期态度，不能拿来预测美联储货币政策，因为这个概率是会不断随着最新经济数据变化而变化。比如要是下个月美国 CPI 出现较大反弹，那9月降息的概率就会大幅下降。而这次市场预期美联储9月降息的概率大幅上升，主要有两个原因，一、美联储鲍威尔在7月 10 日的国会听证会上整体态度偏戈。鲍威尔称，劳动力市场降温意味着持续高通胀的潜在源头已经减弱。他还表示，就业市场的进一步疲软可能是不必要的，也是不受欢迎的。鲍威尔说，通胀方面的工作还没有完成，我们还有更多工作要做，但与此同时，我们需要注意劳动力市场现况，我们已经观察到劳动力市场出现相当明显的疲软，有着新美联储通讯社之称的知名记者尼奇默尔斯认为，鲍威尔本周其实已暗示美联储的利率政策即将开始改变方向。'
        },
        timeCost: '7.9'
      },
      {
        context: {
          dataTable: [
            {
              时间: '7 月 11 日晚上 8 点半',
              数据类型: '6 月 CPI 同比上涨率',
              数值: 3,
              市场预期值: 3.1,
              前值: 3.3,
              年份: '2023',
              月份: '6'
            },
            {
              时间: '7 月 11 日晚上 8 点半',
              数据类型: '6 月 CPI 环比增长率',
              数值: -0.1,
              市场预期值: null,
              前值: null,
              年份: '2023',
              月份: '6'
            }
          ],
          fieldInfo: [
            {
              fieldName: '时间',
              description: '数据公布的时间',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '数据类型',
              description: '通胀数据的类型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '数值',
              description: '具体的数值',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场预期值',
              description: '市场对数据的预期值',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '前值',
              description: '上一次的数据值',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '月份',
              description: '数据对应月份',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '第二个原因是7月 11 日晚上 8 点半美国劳工部公布的通胀数据，6月 CPI 是同比上涨3%，市场预期值3.1%，前值3.3%。这次美联储 CPI 回落，更关键是 CPI 环比是负增长0.1%，这是美国 2020 年5月以来 CPI 环比首次出现下降，而且美国 2020 年5月还是因为疫情导致的 CPI 骤降，是比较特殊时期，所以美国 CPI 环比负增长确实不太常见。但仔细看美国 VI 月 CPI 的具体构成，感觉猫腻还是不少的。'
        },
        timeCost: '9.3'
      },
      {
        context: {
          dataTable: [
            {
              地区: '美国',
              月份: '6月',
              商品: '汽油',
              价格变化: -3.8
            },
            {
              地区: '美国',
              月份: '6月',
              商品: '食品和住房',
              价格变化: 0.2
            },
            {
              地区: '美国',
              月份: '6月',
              商品: '原油期货',
              价格变化: '未提及'
            },
            {
              地区: '美国',
              月份: '6月',
              商品: '核心通胀（刨除能源和食品价格）',
              通胀率: 3.3
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '数据所涉及的地区',
              type: 'string',
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
              fieldName: '商品',
              description: '涉及的商品种类',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格变化',
              description: '价格的涨跌幅度',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '通胀率',
              description: '通货膨胀率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '美国 VI 月 CPI 下降的主要贡献是汽油价格下跌。美国 VI 月汽油价格下跌了3.8%，抑制了当月通胀，抵消了食品和住房价格 0.2% 的上涨。比较诡异的是，美国原油期货价格6月是明明出现大幅上涨，这是因为原油期货价格传导到汽油价格有一些迟滞效应，但那样的话，下个月公布的 CPI 数据，汽油价格可能就得反弹了。要是下个月公布的 CPI 数据，汽油价格还继续下降，那就实在说不过去了。美国刨除能源和食品价格的核心通胀率6月是3.3%，但整体降幅还是低于CPI。'
        },
        timeCost: '6.7'
      },
      {
        context: {
          dataTable: [
            {
              国家: '美国',
              月份: '6月',
              通胀类型: '服务业通胀',
              通胀同比涨幅: 5,
              就业数据类型: '非农就业',
              就业人口增加数量: 206000,
              市场预期就业人口增加数量: 190000
            },
            {
              国家: '美国',
              月份: '5月',
              就业数据类型: '非农就业',
              就业人口增加数量: 218000
            },
            {
              国家: '美国',
              月份: '4月',
              就业数据类型: '非农就业',
              就业人口增加数量: 108000
            }
          ],
          fieldInfo: [
            {
              fieldName: '国家',
              description: '涉及的国家',
              type: 'string',
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
              fieldName: '通胀类型',
              description: '通胀的类型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '通胀同比涨幅',
              description: '通胀同比上涨的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '就业数据类型',
              description: '就业数据的类型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '就业人口增加数量',
              description: '非农就业人口增加的人数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场预期就业人口增加数量',
              description: '市场预期非农就业人口增加的人数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '美国通胀目前最顽固的就是服务业通胀，美国 VI 月服务业通胀仍然是同比上涨5%。美国毕竟是服务业为主的国家，服务业通胀还高居5%，美国要说自己已经控制住通胀，完全就是忽悠人。不过虽然美国大选临近，美国现在经济数据基本是为选型服务，比如已经假的不能再假的美国非农就业数据，美国 VI 月非农就业人口增加20.6万人，高于市场预期的 19 万人。然而美国同时把5月数据从 27.2 万人大幅下修至 21.8 万人，4月从 16.5 万人修正至10.8万人，修正后两个月合计较修正前减少 11.1 万人。'
        },
        timeCost: '11.4'
      },
      {
        context: {
          dataTable: [
            {
              市场: '美股',
              日期: '2023-07-11',
              股市走势: '下跌',
              涨跌幅度: -2
            },
            {
              市场: '日股',
              日期: '2023-07-12',
              股市走势: '下跌',
              涨跌幅度: -2.45
            }
          ],
          fieldInfo: [
            {
              fieldName: '市场',
              description: '涉及的市场',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '日期',
              description: '事件发生的日期',
              type: 'date',
              dateGranularity: 'day',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '股市走势',
              description: '股市的涨跌情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '涨跌幅度',
              description: '股市涨跌的百分比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '我注意到虽然这次市场大幅提高了美联储9月降息概率，但美股和日股反而不涨反跌，纳斯达克在7月 11 日是下跌了2%，日股在7月 12 日也跟随下跌了2.45%。这是市场反身性效应的某种预演，股市炒的是预期，之前美股和日股是基于美联储降息预期，已经提前涨了一年多了，那么当美联储真正降息之后，市场是可能出现反身性效应，也就是所谓利好落地势利空的说法。当然股市走势千变万化，这也只是其中一种可能性。历史的参考例子，比如 2004 年美联储降息， 2006 年停止加息， 2007 年开始降息，但股市是一直涨到 2007 年底，随后自带危机爆发，股市开始大跌。我之前也梳理过，从 1980 年以来，美联储每次加息超过 5% 的幅度，首次加息后的 2- 4 年内都会爆发金融危机，这次美联储是 2022 年开始加息，所以按照历史路径， 2024 年到 2026 年是有可能爆发世界金融危机，这个结合当前国际局势和地缘形势，还是有挺大的可能性。'
        },
        timeCost: '5.4'
      },
      {
        context: {
          dataTable: [
            {
              地区: '黑龙江省',
              时间范围: '10年前至今',
              荒废比例: 60,
              荒废小学数量: 1900
            },
            {
              地区: '东北',
              时间范围: '10年前至今',
              荒废比例: 50,
              荒废小学数量: 6800
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '涉及的地区',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间范围',
              description: '荒废的时间范围',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '荒废比例',
              description: '荒废的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '荒废小学数量',
              description: '荒废的小学数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '以前的小学空荡荡的，老年人养起了鸡鸭鹅狗，彻底荒废了整个黑龙江省， 10 年时间荒废了近六成，小学加起来有 1, 900 余所，整个东北十年荒废了 6, 800 余所小学，少了一半。'
        },
        timeCost: '6.6'
      },
      {
        context: {
          dataTable: [
            {
              地区: '兹西县',
              时间: '2024',
              学龄人口变化情况: null,
              生育率: null
            },
            {
              地区: '徐文县',
              时间: '2023',
              学龄人口变化情况: null,
              生育率: null
            },
            {
              地区: '河南',
              时间: '2023',
              学龄人口变化情况: -2000000,
              生育率: null
            },
            {
              地区: '上海',
              时间: '2024',
              学龄人口变化情况: null,
              生育率: 0.6
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '具体的地理位置',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间',
              description: '相关事件发生的时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '学龄人口变化情况',
              description: '小学学龄人口的数量变化',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '生育率',
              description: '总和生育率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '而小学缺孩子这个趋势早已经蔓延至全国各地了。东部的兹西县，有的小学一个班只有一个学生。华南的徐文县，去年某小学开学，一年级也只有一个学生。中部人口大省河南，据测算， 2023- 2027 年小学学龄人口预计下降 200 多万人，缩水超两成，出现了基数的坍塌。从全国来看，基于学龄人口的预测显示，全国超 1, 400 个县域中，近九成县域小学学龄人口预计下滑，小学鹤岗化以谁也没想到的方式在扩散，从东北开始到大江南北，下一步可能是上海最新的总和生育率只有 0.6 了，该来的总是要来，从民政局冷冷清清到妇产科缺孩子，再到幼儿园关停潮，现在轮到了小学关停潮，这个传播链条还在扩散。'
        },
        timeCost: '6.9'
      },
      {
        context: {
          dataTable: [
            {
              省份数量: 10,
              城市数量: 24,
              城市: '广东惠州',
              房价: 60000
            },
            {
              省份数量: 10,
              城市数量: 24,
              城市: '广西南宁',
              房价: 50000
            },
            {
              省份数量: 10,
              城市数量: 24,
              城市: '山东东营',
              房价: 40000
            },
            {
              省份数量: 10,
              城市数量: 24,
              城市: '江苏南京',
              房价: 30000
            },
            {
              省份数量: 10,
              城市数量: 24,
              城市: '黑龙江大靶',
              房价: 10000
            },
            {
              省份数量: 10,
              城市数量: 24,
              城市: '京津两市交界处某楼盘',
              房价: 390000
            }
          ],
          fieldInfo: [
            {
              fieldName: '省份数量',
              description: '出现房子白菜价情况的省份数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '城市数量',
              description: '出现房子白菜价情况的城市数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '城市',
              description: '出现房子白菜价的具体城市',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '房价',
              description: '房子的价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '实际上，如果鹤岗化只是局限于教育领域，那还好说，但不是实际情况复杂的多楼市，像鹤岗那样房子白菜价的城市越来越多了，据不完全统计，至少有 10 个省 24 个城市陷入几万元买房的讨论。不是每平方米单价几万，而是一套房总价几万。网传广东惠州6万，广西南宁5万，山东东营4万，江苏南京3万，黑龙江大靶1万，这个传播势头在这轮楼市调整的加持下，现在已经来到了北京的外围，在京津两市的交界处，抹楼盘从 160 万元降到了 39 万，而且打了骨折还卖不出去。'
        },
        timeCost: '7.7'
      },
      {
        context: {
          dataTable: [
            {
              地区: '鹤岗',
              事件: '全国第一个财政重整的地级市，传出来停招公务员',
              人口数量: null,
              编制人员数量: null,
              行政管理支出: null,
              一般公共预算收入: null,
              工资预算总支出: null,
              在职人员工资支出: null,
              离退休人员工资支出: null,
              零聘人员工资支出: null,
              在职人员数量: null,
              临聘人员数量: null
            },
            {
              地区: '秦岭深处某县',
              事件: '过紧日子的城市之一',
              人口数量: 30000,
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
              事件: '过紧日子的城市之一',
              人口数量: null,
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
              description: '具体的地方',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '事件',
              description: '地方相关的情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '人口数量',
              description: '地区的人口数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '编制人员数量',
              description: '地区的编制人员数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '行政管理支出',
              description: '一年的行政管理费用',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '一般公共预算收入',
              description: '地区的一般公共预算收入金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '工资预算总支出',
              description: '工资方面的预算总支出金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '在职人员工资支出',
              description: '在职人员的工资支出金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '离退休人员工资支出',
              description: '离退休人员的工资支出金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '零聘人员工资支出',
              description: '零聘人员的工资支出金额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '在职人员数量',
              description: '地区的在职人员数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '临聘人员数量',
              description: '地区的临聘人员数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '地方财力，之前鹤岗是全国第一个财政重整的地级市，甚至传出来停招公务员，现在过紧日子的城市也越来越多了。秦岭深处某县人口只有3万，编制人员却有 2, 194 名，一年的行政管理支出 1, 800 万，排在支出的首位。乌蒙山区某县一般公共预算收入 7 个亿，但工资预算总支出 26.3 亿，其中在职人员 20 亿，离退休人员 1.7 亿，零聘人员 4.6 亿。注意一个细节，在职人员数量 1.5 万，临聘人员数量 2.8 万。'
        },
        timeCost: '21.9'
      },
      {
        context: {
          dataTable: [
            {
              城市: '深圳',
              年份: '2021',
              房价走势: '持续低迷',
              二手房均价跌幅: -40,
              房源情况: '各热点城市二手房每成交一套就要多出好几套',
              飞天茅台价格相关: '新增的房源和房价表现几乎完全正相关的是53度飞天茅台的价格'
            }
          ],
          fieldInfo: [
            {
              fieldName: '城市',
              description: '涉及的城市名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '房价走势',
              description: '房价的变化情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '二手房均价跌幅',
              description: '二手房均价相比最高点的下跌比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '房源情况',
              description: '各热点城市二手房的成交与新增房源情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '飞天茅台价格相关',
              description: '与房价表现相关的飞天茅台价格情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '中国房价一度被视为坚不可摧的资产堡垒，更一度有京沪永远涨的口号。然而，自 2021 年以来，包括一线城市在内，房价持续低迷，深圳全市二手房均价距离 2021 年初的最高点跌幅已接近40%，而且还没有停下来的意思。各热点城市二手房每成交一套就要多出好几套，新增的房源和房价表现几乎完全正相关的是飞天茅台的价格， 53 度。'
        },
        timeCost: '6.5'
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
              description: '所涉及的商品名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格',
              description: '商品的价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '飞天茅台在 2021 年巅峰时期，一瓶售价超过 3, 500 元，如今已经快跌破 2, 000 元，是巧合吗？过去一线城市房价和飞天茅台价格可以说是最硬的人民币计价资产了，甚至比现金还要优质。一线房产和飞天茅台在相当长的一段时间内有两个相同属性，一他们可以长期增值。二他们易于套现。然而现在情况出现了前所未有的变化，房价和飞天茅台两者双双在 2012 一年见顶。'
        },
        timeCost: '5.1'
      },
      {
        context: {
          dataTable: [
            {
              品牌: '保时捷',
              年份: '2021',
              车型: 'Macan',
              原价: 608000,
              优惠金额: 160000,
              优惠后价格: 448000,
              折扣力度: 80
            },
            {
              品牌: '保时捷',
              年份: '2024',
              车型: '泰肯',
              原价: 1038000,
              优惠金额: 338000,
              优惠后价格: 700000,
              折扣力度: 70
            }
          ],
          fieldInfo: [
            {
              fieldName: '品牌',
              description: '汽车品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '车型',
              description: '汽车具体型号',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '原价',
              description: '汽车的初始价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '优惠金额',
              description: '汽车的优惠价格数额',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '优惠后价格',
              description: '汽车优惠后的价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '折扣力度',
              description: '汽车的折扣比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '这不是巧合，其他很多数据也都在 2021 年见顶，比如另一个在 2021 年见顶并开始走下神坛的保时捷。保时捷销量的恶化还在加速，过去一年多，中国市场上保时捷的落地价可以说是惨不忍睹。近期，保时捷只卖 44 万的话题也引发了热议，其华南区域一家终端门店称， Macan 正在进行优惠促销，最高优惠 16 万，该车优惠后最低售价为 44.8 万。另外，在山东、湖北、江西、福建、浙江、江苏等多省份，该车均出现了 50 万元以下的裸车价，而报价达到 103.8 万的泰肯，现在 70 多万就可以拿下。目前，保时捷几乎所有的车型都可以打 7- 8 折。'
        },
        timeCost: '12.7'
      },
      {
        context: {
          dataTable: [
            {
              汽车品牌: '保时捷',
              时间: '2024-Q1',
              销售量: 16340,
              同比变化率: -24
            },
            {
              汽车品牌: '保时捷',
              时间: '2024-05',
              销售量: 4633,
              同比变化率: -40.61
            }
          ],
          fieldInfo: [
            {
              fieldName: '汽车品牌',
              description: '豪华汽车的品牌名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间',
              description: '销售数据对应的时间',
              type: 'date',
              dateGranularity: 'quarter',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '销售量',
              description: '汽车的销售数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '同比变化率',
              description: '与上年同期相比的销售变化比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '不只是保时捷，包括奔驰、宝马、奥迪在内的豪华汽车品牌今年以来都在大幅降价，但仍然止不住销量断崖式下降。 2024 年一季度，保时捷中国卖出 16, 340 辆，同比大幅下降24%。保时捷在今年 5 月份仅卖出 4, 633 辆，同比去年5月下滑高达40.61%。这说明保时捷在中国的销量正在加速减少。'
        },
        timeCost: '4.8'
      },
      {
        context: {
          dataTable: [
            {
              车型: '特斯拉 3 和 y',
              地区: '中国',
              起始时间: '2022',
              售价: null,
              原本指导价: null,
              '美国起售价（美元）': null,
              中国售价与美国售价对比: null
            },
            {
              车型: '卡罗拉',
              地区: '中国',
              起始时间: '2022',
              售价: 79800,
              原本指导价: 131800,
              '美国起售价（美元）': 23500,
              中国售价与美国售价对比: 50
            },
            {
              车型: '凯美瑞',
              地区: '中国',
              起始时间: '2022',
              售价: 149800,
              原本指导价: null,
              '美国起售价（美元）': null,
              中国售价与美国售价对比: null
            },
            {
              车型: '汉兰达',
              地区: '中国',
              起始时间: '2022',
              售价: null,
              原本指导价: null,
              '美国起售价（美元）': null,
              中国售价与美国售价对比: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '车型',
              description: '汽车的型号',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '地区',
              description: '汽车销售的地区',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '起始时间',
              description: '价格对比的起始时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '售价',
              description: '汽车的销售价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '原本指导价',
              description: '汽车原本的指导价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '美国起售价（美元）',
              description: '美国油电混动卡罗拉的起售价格（以美元计）',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '中国售价与美国售价对比',
              description: '中国售价相对于美国售价的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '从两年前开始，特斯拉的 3 和 y 中国售价就是世界最低的， 7.98 万可以买到原本指导价 13.18 万的油电混动的卡罗拉。做一个对比，美国的油电混动卡罗拉的起售价是 2.35 万美元，有时甚至还要加价。按照美元人民币汇率计算，这款车的中国售价居然只有美国的一半水平，尽管配置存在差异，但不影响价格差异巨大的这个结论。除了卡罗拉外，汉兰达和凯美瑞也都大幅降价，即使是两年前，我们也很难想象只要 14.98 万人民币就可以买到最新款的混动版凯美瑞。'
        },
        timeCost: '13.1'
      },
      {
        context: {
          dataTable: [
            {
              交通方式: '打车（十多年前）',
              时间: '十多年前',
              价格范围: [110, 120]
            },
            {
              交通方式: '滴滴（现在）',
              时间: '2024',
              价格范围: [60, 70]
            },
            {
              交通方式: '出租车（现在）',
              时间: '2024',
              价格范围: [110, 120]
            }
          ],
          fieldInfo: [
            {
              fieldName: '交通方式',
              description: '出行的交通方式',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间',
              description: '数据对应的时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '价格范围',
              description: '从首都机场到西直门的价格区间',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国物价的下降不仅仅体现在商品上，服务价格也是类似的趋势。举个例子，十多年前我常驻北京，当时经常在晚上十一二点从首都机场打车到西直门这样一段单程大约需要 110- 120 元，而现在滴滴大概只要 60- 70 元。如果是现在的出租车，价格和十多年前还是一样的。'
        },
        timeCost: '5.0'
      },
      {
        context: {
          dataTable: [
            {
              银行: '工行',
              年份: '2022',
              个人住房贷款不良率: 0.39
            },
            {
              银行: '工行',
              年份: '2023',
              个人住房贷款不良率: 0.44
            },
            {
              银行: '农行',
              年份: '2022',
              个人住房贷款不良率: 0.51
            },
            {
              银行: '农行',
              年份: '2023',
              个人住房贷款不良率: 0.55
            },
            {
              银行: '建行',
              年份: '2022',
              个人住房贷款不良率: 0.37
            },
            {
              银行: '建行',
              年份: '2023',
              个人住房贷款不良率: 0.42
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
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '个人住房贷款不良率',
              description: '个人住房贷款的不良率',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '以工行、农行、建行发布的数据来看，其 2023 年个人住房贷款不良率分别由 2022 年的0.39%、0.51%、 0.37% 增长至了0.44%、 0.55% 和0.42%，基本都实现了两位数的增幅。大家别觉得这些小数字没啥大不了的，要知道这三家银行每一家的个人住房贷款余额都超过了5万亿，而且按揭贷款往年基本上都是银行稳赚不赔的买卖。供建农三家银行之所以每年能够包揽中国最赚钱企业的前三名，按揭贷款所带来的收益贡献巨大。现在这个优质资产的不良率正在以每年两位数的增幅增加。'
        },
        timeCost: '7.8'
      },
      {
        context: {
          dataTable: [
            {
              年份: '2022',
              法拍房挂牌数量: 980000,
              法拍房挂牌数量同比增长率: null
            },
            {
              年份: '2023',
              法拍房挂牌数量: 1410000,
              法拍房挂牌数量同比增长率: '43.9'
            },
            {
              年份: '2024',
              法拍房挂牌数量: 604400,
              法拍房挂牌数量同比增长率: '192'
            },
            {
              年份: '2024',
              法拍房挂牌数量: 2000000,
              法拍房挂牌数量同比增长率: null
            }
          ],
          fieldInfo: [
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '法拍房挂牌数量',
              description: '全国法拍房挂牌的套数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '法拍房挂牌数量同比增长率',
              description: '法拍房挂牌数量的同比增长比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '你是银行，你慌不慌？而另一项作为佐证的数据则是法拍房，大家知道现在法拍房的数据有多夸张吗？根据瀚海研究院发布的数据显示， 2022 年全国共挂牌法拍房 98 万套，去年这个数字变成了 141 万套，增长了43.9%。而今年光是一季度的挂牌数量就已飙升至 60.44 万套通，同比上涨192%。这种局势下，银行要是再不改变断供处置策略，那今年的法拍数量估计有望达到 200 万。'
        },
        timeCost: '6.5'
      },
      {
        context: {
          dataTable: [
            {
              地区: '北京',
              年份: '2023',
              挂牌法拍房数量: 8153,
              成交法拍房数量: 2771,
              处置率: 33
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '涉及的地区名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应的时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '挂牌法拍房数量',
              description: '挂牌法拍房的套数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '成交法拍房数量',
              description: '成交的法拍房套数',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '处置率',
              description: '成交法拍房数量占挂牌法拍房数量的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '事实上，对银行来说，现在的行情即使他收了房也难以处置。我们以北京为例， 2023 年北京挂牌法拍房 8, 153 套，最终成交仅 2, 771 套，处置率为33%，这还是房价波动相对较小的北京，换到其他已经跌穿首付的地区，处置率恐怕只会更低。而在法拍流程里，流拍和拍品二次上拍都会在此前的价格上更进一步降低，这也导致了银行回款难度的进一步提高。虽然按照现在的规则，这部分差价是由贷款人承担的，但对方既然已经到了选择断供的地步，可想而知最终也执行不了多少。'
        },
        timeCost: '6.1'
      },
      {
        context: {
          dataTable: [
            {
              时间: '2024-04-30',
              行业: '房地产',
              发展方向: '统筹消化存量房产和优化增量住房',
              未出售商品房面积: 746000000,
              正常库存水平面积: 590000000,
              城市数量: 222,
              宽松政策数量: 341,
              销售面积情况: '持续走低',
              投资金额情况: '持续走低'
            }
          ],
          fieldInfo: [
            {
              fieldName: '时间',
              description: '相关事件发生的时间',
              type: 'date',
              dateGranularity: 'day',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '行业',
              description: '涉及的行业',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '发展方向',
              description: '行业的发展方向',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '未出售商品房面积',
              description: '我国未出售的商品房面积',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '正常库存水平面积',
              description: '商品房的正常库存水平面积',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '城市数量',
              description: '出台宽松政策的城市数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '宽松政策数量',
              description: '出台的宽松政策数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '销售面积情况',
              description: '销售面积的变化情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '投资金额情况',
              description: '投资金额的变化情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            }
          ],
          text: '另一项推动银行改变策略的原因，则是今年4月 30 号的一场会议，这场会议确定了房地产行业未来一年的发展方向，统筹消化存量房产和优化增量住房，用大家都熟悉的话来说就是去库存。根据国家统计局的官方数据显示，截至 2024 年5月，我国未出售商品房为 7.46 亿平米，远超 5.9 亿平米的正常库存水平。而整个上半年，根据 CRS 的统计，全国 222 个城市总计出台了 341 项宽松政策，但带来的效果均不理想，无论是销售面积还是投资金额，仍然在持续走低。'
        },
        timeCost: '11.1'
      },
      {
        context: {
          dataTable: [
            {
              职业: '财经记者，大学老师，滴滴司机，up 主',
              年份: '2023',
              国家: '中国',
              汽车出口量: 4910000
            },
            {
              职业: '财经记者，大学老师，滴滴司机，up 主',
              年份: '2023',
              国家: '日本',
              汽车出口量: null
            },
            {
              职业: '财经记者，大学老师，滴滴司机，up 主',
              年份: '2021',
              国家: '中国',
              汽车出口量: 2020000
            },
            {
              职业: '财经记者，大学老师，滴滴司机，up 主',
              年份: '2022',
              国家: '中国',
              汽车出口量: 3110000
            }
          ],
          fieldInfo: [
            {
              fieldName: '职业',
              description: '个人从事过的职业',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '汽车出口量相关的国家',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '汽车出口量',
              description: '汽车出口的数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '大家好，我拍拍一名做过财经记者，大学老师和滴滴司届 up 主。 2023 年，我国汽车出口量达到了 491 万辆，超越日本成为世界第一汽车出口国。要知道，日本在这个位置坐了 8 年之久，而中国仅在过去三年时间里接连赶超韩国、德国、日本。中国汽车出口， 2021 年 202 万辆， 2022 年 311 万辆， 2023 年 491 万辆。'
        },
        timeCost: '6.2'
      },
      {
        context: {
          dataTable: [
            {
              车型: '名爵ZS',
              国内指导价: 80000
            },
            {
              车型: '名爵ZS',
              国内指导价: 90000
            },
            {
              车型: '特斯拉 model y',
              国内指导价: null
            },
            {
              车型: '奇瑞瑞虎7',
              国内指导价: 100000
            },
            {
              车型: '特斯拉 model 3',
              国内指导价: null
            },
            {
              车型: '名爵 4 EV',
              国内指导价: 100000
            },
            {
              车型: '奇瑞虎5X',
              国内指导价: 100000
            },
            {
              车型: '欧盟达名爵5',
              国内指导价: 100000
            },
            {
              车型: '缤越元plus',
              国内指导价: 100000
            },
            {
              车型: '名爵 5',
              国内指导价: 60000
            },
            {
              车型: '缤越',
              国内指导价: 60000
            }
          ],
          fieldInfo: [
            {
              fieldName: '车型',
              description: '中国乘用车出口的具体车型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国内指导价',
              description: '车辆在国内的指导价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国汽车转眼间为何变得这么受欢迎呢？又到底是哪些国家在购买中国汽车？中国卖给老外汽车又是些什么品牌和价位车型？本期视频就为大家打开中国汽车出口全球第一背后的真实数据。首先，中国出口的 491 万辆汽车都是些什么车呢？根据乘联会统计，中国乘用车出口量前十车型分别为名爵ZS、特斯拉 model y、奇瑞瑞虎7、特斯拉 model 3、名爵 4 EV、奇瑞虎5X、欧盟达名爵5、缤越元plus。除了特斯拉的 model y 和 model 3，其他车型国内指导价基本都在 10 万元左右，比如排名第一的名爵ZS，指导价 8- 9万元，最便宜的名爵 5 和缤越低到6万元就能拿下，可见中国汽车出海主打的还是一个性价比。'
        },
        timeCost: '8.6'
      },
      {
        context: {
          dataTable: [
            {
              车辆类型: '燃油车',
              年份: '2013',
              出口数量: 3710000,
              占出口总量比例: null,
              新能源出口增速: null
            },
            {
              车辆类型: '新能源车',
              年份: '2013',
              出口数量: 1200000,
              占出口总量比例: 25,
              新能源出口增速: null
            },
            {
              车辆类型: '新能源车',
              年份: '2023',
              出口数量: null,
              占出口总量比例: null,
              新能源出口增速: 77.6
            }
          ],
          fieldInfo: [
            {
              fieldName: '车辆类型',
              description: '车的类型，包括燃油车和新能源车',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '出口数量',
              description: '车辆的出口数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '占出口总量比例',
              description: '新能源车占出口总量的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源出口增速',
              description: '新能源汽车出口的增长速度',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '如果按燃油车、新能源车的分类来看， 2013 年中国出口燃油车 371 万辆，出口新能源汽车 120 万辆，新能源车占到出口总量的25%，虽然这个占比目前只有 1/ 4，但去年新能源出口增速是77.6%，势头不可谓不猛。'
        },
        timeCost: '7.5'
      },
      {
        context: {
          dataTable: [
            {
              国家: '俄罗斯',
              年份: '2013',
              出口量: 909000
            },
            {
              国家: '墨西哥',
              年份: '2013',
              出口量: 415000
            },
            {
              国家: '比利时',
              年份: '2013',
              出口量: 217000
            },
            {
              国家: '澳大利亚',
              年份: '2013',
              出口量: 214000
            },
            {
              国家: '英国',
              年份: '2013',
              出口量: 214000
            },
            {
              国家: '沙特阿拉伯',
              年份: '2013',
              出口量: 213000
            },
            {
              国家: '菲律宾',
              年份: '2013',
              出口量: 172000
            },
            {
              国家: '泰国',
              年份: '2013',
              出口量: 169000
            },
            {
              国家: '阿联酋',
              年份: '2013',
              出口量: 159000
            },
            {
              国家: '西班牙',
              年份: '2013',
              出口量: 139000
            },
            {
              地区: '欧洲',
              年份: '2013',
              占比: 38
            }
          ],
          fieldInfo: [
            {
              fieldName: '国家',
              description: '汽车出口的目的地国家',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '出口量',
              description: '中国汽车对该国的出口数量（万辆）',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '地区',
              description: '汽车出口的市场地区',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '占比',
              description: '该地区在中国汽车对外出口中的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '那中国汽车出口都卖到了哪些国家呢？ 2013 年中国汽车出口量前十的国家分别是，俄罗斯90.9万辆，墨西哥 41.5 万辆，比利时 21.7 万辆，澳大利亚 21.4 万辆，英国 21.4 万辆，沙特阿拉伯 21.3 万辆，菲律宾 17.2 万辆，泰国 16.9 万辆，阿联酋 15.9 万辆，西班牙 13.9 万辆。按地区来看的话，欧洲市场占中国汽车对外出口的38%，远超其他任何单一大洲，可见中国汽车正在得到全世界更多人的认可。'
        },
        timeCost: '12.6'
      },
      {
        context: {
          dataTable: [
            {
              国家: '俄罗斯',
              年份: '2022',
              对该国汽车出口量: 160000,
              出口量增长比例: null,
              该国新车市场品牌: null,
              市场占有率: null
            },
            {
              国家: '俄罗斯',
              年份: '2023',
              对该国汽车出口量: 909000,
              出口量增长比例: 468,
              该国新车市场品牌: '拉达',
              市场占有率: null
            },
            {
              国家: '俄罗斯',
              年份: '2023',
              对该国汽车出口量: 909000,
              出口量增长比例: 468,
              该国新车市场品牌: '奇瑞金车',
              市场占有率: 11.2
            },
            {
              国家: '俄罗斯',
              年份: '2023',
              对该国汽车出口量: 909000,
              出口量增长比例: 468,
              该国新车市场品牌: '哈弗',
              市场占有率: 10.6
            },
            {
              国家: '俄罗斯',
              年份: '2023',
              对该国汽车出口量: 909000,
              出口量增长比例: 468,
              该国新车市场品牌: '极客',
              市场占有率: null
            },
            {
              国家: '俄罗斯',
              年份: '2023',
              对该国汽车出口量: 909000,
              出口量增长比例: 468,
              该国新车市场品牌: null,
              市场占有率: 51
            },
            {
              国家: '俄罗斯',
              年份: '2024',
              对该国汽车出口量: null,
              出口量增长比例: null,
              该国新车市场品牌: null,
              市场占有率: 80
            }
          ],
          fieldInfo: [
            {
              fieldName: '国家',
              description: '涉及的国家',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '对该国汽车出口量',
              description: '中国对该国的汽车出口数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口量增长比例',
              description: '中国对该国汽车出口量的增长百分比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '该国新车市场品牌',
              description: '在该国新车市场中的汽车品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场占有率',
              description: '汽车品牌在该国新车市场的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然了，中国汽车出口世界第一，又不得不提议俄罗斯和墨西哥这两个国家可以说去年是把中国车买爆了。 203 年，中国对俄罗斯的汽车出口量从上一年度的 16 万辆暴增到了90.9万辆，增加了468%。在俄罗斯的新车市场中，第一名是俄罗斯品牌拉达，第二至第七名则全都是中国品牌，比如第二名是奇瑞金车，市场占有率11.2%。第三名是哈弗，新车，市场占有率10.6%。俄罗斯卖最好的新能源车也是来自中国的极客。目前中国汽车已经占据俄罗斯新车市场的51%，可以说是拿下了半壁江山。而对于中国而言，仅俄罗斯一个国家 203 年就贡献了中国汽车出口增量的42%，甚至有俄罗斯本土汽车经销商预测， 2024 年中国汽车可能占据俄罗斯新车份额的80%。'
        },
        timeCost: '15.3'
      },
      {
        context: {
          dataTable: [
            {
              地区: '俄罗斯',
              年份: '2013',
              国家: '欧洲',
              市场份额变化前: 18,
              市场份额变化后: 4
            },
            {
              地区: '俄罗斯',
              年份: '2013',
              国家: '韩国',
              市场份额变化前: 16,
              市场份额变化后: 6
            },
            {
              地区: '俄罗斯',
              年份: '2013',
              国家: '日本',
              市场份额变化前: 12,
              市场份额变化后: 5
            }
          ],
          fieldInfo: [
            {
              fieldName: '地区',
              description: '汽车市场所在地区',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '国家',
              description: '汽车来源国家',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额变化前',
              description: '变化前的市场份额占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '市场份额变化后',
              description: '变化后的市场份额占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '有人说俄罗斯满爆中国汽车是因为欧美的贸易封锁，这也步无道理。 2013 年在俄罗斯的新车市场中，欧洲的市场份额从 18% 降到了4%，韩国从 16% 降到了6%，日本从 12% 降到了5%，和欧日韩都是对俄罗斯实行了限制出口国家，其中就包括了部分汽车，可以说中国汽车吃下的正是欧日韩在俄罗斯丢掉市场。'
        },
        timeCost: '6.4'
      },
      {
        context: {
          dataTable: [
            {
              国家: '墨西哥',
              年份: '2013',
              中国汽车在该国销售汽车中的占比: 25,
              中国汽车品牌: null,
              中国汽车销量: null,
              中国新能源车在该国新能源车市场的份额: null
            },
            {
              国家: '墨西哥',
              年份: '2007',
              中国汽车在该国销售汽车中的占比: 0,
              中国汽车品牌: null,
              中国汽车销量: null,
              中国新能源车在该国新能源车市场的份额: null
            },
            {
              国家: '澳大利亚',
              年份: '2023',
              中国汽车在该国销售汽车中的占比: null,
              中国汽车品牌: '名爵',
              中国汽车销量: 58000,
              中国新能源车在该国新能源车市场的份额: null
            },
            {
              国家: '澳大利亚',
              年份: '2023',
              中国汽车在该国销售汽车中的占比: null,
              中国汽车品牌: null,
              中国汽车销量: null,
              中国新能源车在该国新能源车市场的份额: 14
            }
          ],
          fieldInfo: [
            {
              fieldName: '国家',
              description: '购买中国汽车的国家',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '中国汽车在该国销售汽车中的占比',
              description: '该国销售汽车中来自中国的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '中国汽车品牌',
              description: '在该国受欢迎的中国汽车品牌',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '中国汽车销量',
              description: '中国汽车在该国的销售数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '中国新能源车在该国新能源车市场的份额',
              description: '中国新能源车在该国新能源车市场的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然了，除了俄罗斯之外，其他国家也在买中国汽车，比如墨西哥。 2013 年，墨西哥所有销售汽车中有 25% 来自中国，而在 6 年前这个数字为0。澳大利亚也在不断买中国汽车，最受澳大利亚欢迎的中国汽车品牌是名爵，去年卖了 5.8 万辆。在新能源车市场，比亚迪则占据了澳大利亚的新能源汽车 14% 份额，位于第二名。'
        },
        timeCost: '12.8'
      },
      {
        context: {
          dataTable: [
            {
              品牌: '特斯拉',
              市场: '全球',
              年份: null,
              市场份额: 53,
              出口汽车数量: null,
              出口汽车数量倍数: null,
              新能源汽车平均出口价格: null
            },
            {
              品牌: '中国车企',
              市场: '东南亚',
              年份: 2013,
              市场份额: null,
              出口汽车数量: null,
              出口汽车数量倍数: null,
              新能源汽车平均出口价格: null
            },
            {
              品牌: '中国品牌',
              市场: '泰国新能源车市场',
              年份: null,
              市场份额: 80,
              出口汽车数量: null,
              出口汽车数量倍数: null,
              新能源汽车平均出口价格: null
            },
            {
              品牌: '比亚迪',
              市场: '全球',
              年份: 2023,
              市场份额: null,
              出口汽车数量: 240000,
              出口汽车数量倍数: 3.34,
              新能源汽车平均出口价格: null
            },
            {
              品牌: '比亚迪',
              市场: '泰国新能源车市场',
              年份: null,
              市场份额: 40,
              出口汽车数量: null,
              出口汽车数量倍数: null,
              新能源汽车平均出口价格: null
            },
            {
              品牌: '中国新能源汽车',
              市场: '全球',
              年份: 2019,
              市场份额: null,
              出口汽车数量: null,
              出口汽车数量倍数: null,
              新能源汽车平均出口价格: 5000
            },
            {
              品牌: '中国新能源汽车',
              市场: '全球',
              年份: 2022,
              市场份额: null,
              出口汽车数量: null,
              出口汽车数量倍数: null,
              新能源汽车平均出口价格: 22000
            }
          ],
          fieldInfo: [
            {
              fieldName: '品牌',
              description: '汽车品牌名称',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场',
              description: '汽车销售的市场区域',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '市场份额',
              description: '在该市场的占比',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口汽车数量',
              description: '车企的出口汽车数量',
              type: 'count',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '出口汽车数量倍数',
              description: '出口汽车数量相较于上一年度的倍数',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '新能源汽车平均出口价格',
              description: '中国新能源汽车平均每辆的出口价格',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '当然，这里也不得不提一下第一名，那就是特斯拉市场份额高达53%，在东南亚市场，中国车企业销量在 2013 年同样实现小幅上升，最典型的就是泰国，在泰国的新能源车市场，中国品牌占据了 80% 的份额，比如比亚迪的原 plus 就是泰国的新能源车爆款，那到底是什么原因让中国汽车爆卖呢？基本还可以总结为三方面原因，首先是全球疫情爆发，由于中国汽车的供应链完善，疫情期间仍能维持稳定生产，而日韩这些过去的出口大户受疫情影响，芯片、钢材、橡胶等关键原材料短缺，不仅汽车产能下降，而且成本升高，这就让中国汽车更具性价比。而随着中国国内新能源汽车市场越来越卷出海，成为不少中国车企的选择，比如比亚迪 2023 年进入全球 58 个国家和地区，出口汽车 24 万辆，是上一年度的 3.34 倍。在泰国新能源车市场，比亚迪单独占到了 40% 的市场份额，是名副其实的泰国新能源汽车销冠。而且中国新能源汽车并非只是具备成本优势，汽车与 AI 互联网融合的智能化更是中国车企的拿手好戏。从豪华配置到智能大屏，从外观设计到内饰比拼，这让中国新能源汽车的溢价能力明显变高。2019 年中国新能源汽车平均出口价格每量只有 5, 000 美元， 2022 年涨到了 2.2 万美元。比如比亚迪汉在欧洲发布时价格接近 50 万人民币，是国内售价的两倍多。在泰国、以色列、新西兰等多个国家，比亚迪也已经是新能源汽车的销售冠军。不过，中国汽车征服海外虽然是一部励志爽门，但其实有不少挑战。'
        },
        timeCost: '16.7'
      },
      {
        context: {
          dataTable: [
            {
              国家: '中国',
              时间: '2000',
              产品: '摩托车',
              在该国市场份额: 80
            },
            {
              国家: '日本',
              时间: '2000',
              产品: '摩托车',
              在该国市场份额: 20
            },
            {
              国家: '日本',
              时间: '2024',
              产品: '摩托车',
              在该国市场份额: 95
            },
            {
              国家: '中国',
              时间: '2024',
              产品: '摩托车',
              在该国市场份额: 1
            }
          ],
          fieldInfo: [
            {
              fieldName: '国家',
              description: '涉及的国家',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间',
              description: '相关事件发生的时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '产品',
              description: '涉及的产品',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '在该国市场份额',
              description: '在该国市场所占的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '其实中国汽车出海不禁让人想起曾经的中国摩托车出海。 2000 年前后，中国摩托车进军越南，一度占据了 80% 的越南市场份额，但不到三四年时间，却被日本摩托车打得片甲不留。如今日本摩托车在越南占据 95% 的份额，而中国摩托车百分之一都不到。曾经也有大量中国摩托车车企在越南建厂，但却形成了恶性竞争的关系，疯狂打价格战，导致服务和质量越来越差，越南的中国摩托车车企仿佛是飘在越南的。'
        },
        timeCost: '4.9'
      },
      {
        context: {
          dataTable: [
            {
              企业类型: '规模以上制造企业',
              企业数量: 445000
            },
            {
              企业类型: '存续的制造业企业',
              企业数量: 6220000
            },
            {
              企业类型: '规模以下的中小微工厂',
              企业数量: 4000000
            },
            {
              企业类型: '工厂规模不到50人的工厂',
              工厂规模: '不到50人',
              工厂占比: 40
            },
            {
              企业类型: '工厂规模不到500人的工厂',
              工厂规模: '不到500人',
              工厂占比: 90
            }
          ],
          fieldInfo: [
            {
              fieldName: '企业类型',
              description: '制造业企业的分类',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '企业数量',
              description: '该类型企业的数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '工厂规模',
              description: '工厂的人员规模情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '工厂占比',
              description: '该规模工厂占比情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '每个中国制造品牌的背后都有一批优秀的零部件供应商，像汇川技术、恒力液压、先导智能、顺域光学、军胜电子这样的零部件企业也是中国制造的骄傲，只不过知名度无法媲美消费者直接接触的终端品牌。按照官方的口径，中国规模以上也就是年销售收入 2, 000 万以上的制造企业有 44.5 万家。至于中国一共有多少家制造业企业存在各种口径，从 300 多万家到近千万家不等。万德资讯给我的数据是，中国大约有 622 万家存续的制造业企业。海之在线是一家总部在上海，聚焦中间品贸易的数字化平台，连接着 70 万家工厂，他们给我的数据是，中国规模以下的中小微工厂大致有 400 万家。这期节目标题中的 400 万家沉默工厂处处记载于此。海志在线的创始人、 CEO 佘莹对我说，从平台看， 40% 的工厂规模不到 50 人，近 90% 的工厂不到 500 人，大部分工厂的年产值在数百万元到数千万元。如果和大企业比，你可以说他们就是一个个的小做法。如果走进去可能会看到老旧的机器上油漆斑驳，可以看到生产计划就用记号笔写在车间墙上挂着的白板上，甚至会发现用破洞的木板随意围搭起来的厕所，待客的茶水里则混杂着浓浓的机油味。但他们就是中国制造业毛细血管层面的供应链小节点，勤勤恳恳的维护设备、搞生产，他们最在意的是生存，是接到订单以及在满足客户之后能够完整的收到货款。'
        },
        timeCost: '8.6'
      },
      {
        context: {
          dataTable: [
            {
              事项: '铝和其他废且金属产量变化',
              时间: '2024',
              相关数据: 20,
              产量变化: 20
            },
            {
              事项: '钢铁产量变化',
              时间: '2024',
              相关数据: [-5, -10],
              产量变化: [-5, -10]
            },
            {
              事项: '对开发商的银行贷款增长',
              时间: '2024',
              相关数据: 19,
              贷款增长情况: 19
            },
            {
              事项: '房贷和存款跟预付款的比例下降',
              时间: '2024',
              相关数据: [-30, -40],
              贷款增长情况: [-30, -40]
            }
          ],
          fieldInfo: [
            {
              fieldName: '事项',
              description: '涉及的具体事项',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '时间',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '相关数据',
              description: '与事项相关的具体数据',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '产量变化',
              description: '金属产量的变化情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '贷款增长情况',
              description: '银行贷款的增长情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '有报道称，一些地方政府面临收入短缺，要求企业缴纳可追溯到 1990 年代的税单。这种紧缩政策在房地产市场寻找几步的时刻，会损害上信心和经济。高盛认为，中国中央政府可以通过加大对西方政府的财政支持来切断机房政府无紧缩所出现的负面溢出效应，那如同美国监管机构在次贷危机期间通过成为最后贷款人来切断金融危机的传播一样。关于出口和机产之间的分化，可以同中国的金属生产中得到证实啊。铝和其他废且金属的产量相比疫情之前上升了 20% 以上，而钢铁的产量下降了 5% 到10%。在房产方面，开发商越来越依赖银行融资， 5 月份对开发商的银行贷款同比增长了19%。而随着房地产销售的下滑，房贷和存款跟预付款的比例同比下降了 30% 到40%。高盛银行股票团队预计从 2024 年到 2026 年，房地产贷款将增加 4.5 万亿人民币，以完全期待收缩的房地产债券和设防的影子银行贷款。'
        },
        timeCost: '8.7'
      },
      {
        context: {
          dataTable: [
            {
              领域: '建立燃气和水的生产',
              投资情况: '固定资产投资',
              与疫情前水平对比: 200,
              年份: '2024'
            },
            {
              领域: '整体基建',
              投资情况: '固定资产投资',
              与疫情前水平对比: null,
              年份: '2024'
            },
            {
              领域: '代线销售商品',
              销售类型: '零售销售',
              销售增长情况: 13,
              年份: '2024'
            },
            {
              领域: '餐饮销售',
              销售类型: '零售销售',
              销售增长情况: 5,
              年份: '2024'
            },
            {
              领域: '线下商品销售',
              销售类型: '零售销售',
              销售增长情况: 0,
              年份: '2024'
            }
          ],
          fieldInfo: [
            {
              fieldName: '领域',
              description: '经济领域的分类',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '投资情况',
              description: '相关领域的投资增长情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '与疫情前水平对比',
              description: '与疫情前投资水平的比较',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '年份',
              description: '数据对应时间',
              type: 'date',
              dateGranularity: 'year',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '销售类型',
              description: '零售销售的类型',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '销售增长情况',
              description: '销售的同比增长比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '中国经济分化并不止于出口和房地产基础设施的固定资产投资。细分项显示，建立燃气和水的生产投资已同疫情前水平翻倍，远远超过了整体的基建的投资增长。因为中国政府首先优先考虑农源供用安全和脱碳。在零售销售当中， 5 月份代线销售商品同比增长13%，而餐饮销售仅增长5%，线下商品的销售保持在去年同期的水平。'
        },
        timeCost: '9.6'
      },
      {
        context: {
          dataTable: [
            {
              时间: '7月',
              会议内容: '评估当前经济状况并制定今年剩余时间周期性政策安排',
              经济增长同比: 5.3,
              季度增长预测: null
            },
            {
              时间: '7月',
              会议内容: '解决经济结构中重大改革议程',
              经济增长同比: null,
              季度增长预测: null
            },
            {
              时间: '二季度',
              会议内容: null,
              经济增长同比: null,
              季度增长预测: '>5'
            }
          ],
          fieldInfo: [
            {
              fieldName: '时间',
              description: '会议或数据对应的时间',
              type: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '会议内容',
              description: '会议专注的方面',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '经济增长同比',
              description: '与上年同期相比的经济增长情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '季度增长预测',
              description: '对季度经济增长的预测',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '7月中旬将举行两场重要的政策会议，前者将专注于评估当前的经济状况，并为今年剩余时间制定周期性的政策安排。后者将专注于至少未来五年解决经济结构当中的重大改革议程。鉴于一季度的实际， g GPT 同比增长5.3%，而且去年基数较低，那么 G2 季度增长可能高于5%，政府的全年增长目标仍然在轨道上。'
        },
        timeCost: '7.5'
      },
      {
        context: {
          dataTable: [
            {
              时间: '7月',
              政策领域: '宏观政策',
              政策情况: '政策执行者不会释放重大刺激措施，可能维持当前立场和执行现有政策'
            },
            {
              时间: '5月',
              政策领域: '宏观政策',
              政策情况: '宣布的最后一批措施不及预期，可能引入更多宽松政策'
            },
            {
              时间: '三季度',
              政策领域: '货币政策',
              政策情况: '预计降息25个基点'
            },
            {
              时间: '四季度9月',
              政策领域: '货币政策',
              政策情况: '预计再降息10个基点'
            },
            {
              时间: '今年',
              政策领域: '财政政策',
              政策情况: '预计政府债券发行在下半年显著增加'
            },
            {
              时间: '今年',
              政策领域: '财政政策',
              政策情况: '基建投资不会加速太多，除非增长急剧放缓'
            },
            {
              时间: '今年',
              政策领域: '财政政策',
              政策情况: '高盛预测中国增强型财政赤字从去年的GDP 11.2%适度扩大到今年的11.9%'
            },
            {
              时间: '今年',
              政策领域: '信贷政策',
              政策情况: '信贷增长与GDP增长之间的联系已经减弱'
            },
            {
              时间: '今年',
              政策领域: '信贷政策',
              政策情况: '预计信贷总量的增长将从去年的9.5%放缓到今年的9%'
            },
            {
              时间: '4月',
              政策领域: '住房政策',
              政策情况: '决策者希望严防房地产市场的尾部风险'
            },
            {
              时间: '近期',
              政策领域: '住房政策',
              政策情况: '预计进一步削减房贷利率以刺激需求'
            },
            {
              时间: '短期内',
              政策领域: '外汇政策',
              政策情况: '央行将保持美元对人民币汇率稳定，三个月高盛预测为7.3'
            }
          ],
          fieldInfo: [
            {
              fieldName: '时间',
              description: '数据对应的具体时间',
              type: 'date',
              dateGranularity: 'month',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '政策领域',
              description: '涉及的政策方面',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '政策情况',
              description: '政策的具体情况描述',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '降息基点',
              description: '降息的基点数量',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '赤字占GDP比例',
              description: '增强型财政赤字占GDP的比例',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '信贷增长与GDP增长联系减弱情况',
              description: '信贷增长与GDP增长之间联系的减弱程度',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '信贷总量增长',
              description: '信贷总量的增长情况',
              type: 'ratio',
              role: 'measure',
              location: 'measure'
            },
            {
              fieldName: '房贷利率情况',
              description: '房贷利率的相关情况',
              type: 'string',
              role: 'dimension',
              location: 'dimension'
            },
            {
              fieldName: '汇率',
              description: '美元对人民币汇率',
              type: 'numerical',
              role: 'measure',
              location: 'measure'
            }
          ],
          text: '高盛认为，政策执行者不会在 7 月份的首场会议上释放任何重大的刺激措施，宏观政策的证件可能大于维持当前立场和执行现有的政策。另一方面，鉴于 5 月份宣布的最后一批措施不及预期，可能存在引入更多期产宽松政策的可能性。在货币政策方面，资本外流的担忧和银行利润率的下降限制了央行降息的能力。高盛预计三季度将降息 25 个基减，以适应大量政府债券发行，并预计季四季度9月首次降息后会再降息 10 个期减。在财政政策方面，高盛预计政府债券的发行将在下半年显著增加，以完成年初发行缓慢的全年配额。除非增长急剧放缓，否则基建的投资不会加速太多。对于政府 3 月份公布的预算计划，高盛虽然预测中国的增强型的弹盛赤字从去年的 gdp 11.2% 会适度扩大到今年的11.9%，但由于今年出口强计可能会存在财政扩张不及预期的风险。信贷政策方面，正如央行行长6月 19 号陆家嘴论坛上所说，由于金融套利的虚假贷款和监管机构随后对金融系统中这种资金空转的打击，信贷增长与 GDP 增长之间的联系已经减弱。预计摄容总量的增长将同去年的 9.5% 放缓到今年的9%。在住房政策方面，4月的政治局会议表明，决策者希望严防房地产市场的尾部风险。由于地产价格和活动的持续下行，以及机房国企通过央行的贷款计划购买空池公寓的速度缓慢，高盛预计进一步削减房贷利率以刺激需求，同时为去库存提供更多的资金和效率的支持。在外汇政策方面，鉴于美元持续强势和资本外流的压力，高盛认为央行将在短期内保持美元对人民币汇率的稳定，三个月的高盛预测是7.3，因为外汇市决策者可以迎来抵消关税对出口负面影响的工具。 2018- 19 年的经验表明，如果特朗普赢得美国大选，而且正如他最近几个月所宣称的，会对中国实施正大的关税，那美元兑人民币可能会显著贬值。'
        },
        timeCost: '18.4'
      }
    ]
  }
];
