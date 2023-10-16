import React from 'react';
import { Typography, Card, Timeline } from 'antd';
const { Title, Paragraph, Text } = Typography;

export default () => {
  const { clientHeight } = window?.document?.documentElement;
  return (
    <>
      <Card bodyStyle={{ overflow: 'auto', height: clientHeight - 70 + 'px', margin: '10px 0px' }}>
        <Timeline>

        <Timeline.Item>
            <Title level={4}>[3.0.8] 2023.10.15</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加限流功能</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化HMAC授权关联用户信息</li>
              </ul>
            </Paragraph>
            <Title level={5} type="warning">
            修复BUG
            </Title>
            <Paragraph type="warning">
              <ul className="snam-li">
                <li>修复某些情况下SQL权限解析错误问题</li>
                <li>修复在共享账户状态下，redis低版本导致lpos命令错误的问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[3.0.7] 2023.7.16</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>gateway添加自定义第三方授权Filter，进行第三方权限灵活自定义授权</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化HMAC授权鉴权机制，添加关联businessId，面向业务验证依赖的合法性</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[3.0.6] 2023.5.14</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加Slf4j MDC支持</li>
                <li>添加snapper.wrap.package包配置项，配置包下的所有子包支持统一数据返回封装</li>
                <li>socket消息权限验证支持</li>
                <li>SSE消息推送支持</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[3.0.5] 2023.3.5</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加undertow初始化配置，yml配置文件中不再需要配置undertow</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化http包中连接池，请求优化</li>
                <li>优化字符串与日期时间转化</li>
                <li>优化ObjectMapper数据转化配置</li>
                <li>优化feign调用时信息传递</li>
                <li>优化feign调用实时获取权限数据</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[3.0.4] 2022.12.11</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加docker 脚本及构建文件，支持docker容器启动</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>gateway限流优化，可自定义根据IP和方法限流</li>
                <li>优化log日志展示，warn生产环境下打印root.log 记录所有debug日志、sql.log打印执行的SQL日志、Point.log打印埋点日志</li>
                <li>代码review，代码命名规范化</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[3.0.3] 2022.10.16</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>登录支持微信扫描二维码，需要绑定公众号</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>去掉hystrix依赖，优化熔断机制</li>
                <li>gateway添加重试机制</li>
              </ul>
            </Paragraph>

            <Title level={5} type="warning">
            修复BUG
            </Title>
            <Paragraph type="warning">
              <ul className="snam-li">
                <li>SQL解析错误导致无法加载业务数据权限和列数据权限问题</li>
                <li>业务数据权限与业务查询条件冲突导致无法正确显示数据问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v3.0.2] 2022.7.17</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>Springboot版本升级 2.3.3.RELEASE -&gt; 2.6.14</li>
                <li>SpringCloud版本升级 Hoxton.SR8-&glt; 2021.0.4</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>组件版本升级与兼容性测试</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v3.0.1] 2022.5.22</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加SPI机制进行权限实现</li>
                <li>添加snapper.action.package 自定义配置@Actin扫描包进行启动时扫描，对业务数据权限和列数据权限支持</li>
                <li>添加自定义LogbackLoggerImpl自定义Log，打印执行的SQL语句</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>登录功能提供验证码接口，继承ASystemController来进行验证码集成，通过/api/tauth/token来登录</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v3.0.0] 2022.3.20 全新版本-开始列数据权限</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>数据权限划分为功能数据权限、业务数据权限、列数据权限</li>
                <li>授权管理用户/用户组维度添加业务数据权限支持</li>
                <li>授权管理用户/用户组维度添加列数据权限支持</li>
                <li>添加数据列管理，数据列中配置的列，才可用于业务权限管理的列过滤</li>
                <li>添加@InjestSupport注解，高级查询支持</li>
                <li>添加SqlInjectContext上下文存储高级查询对象</li>
                <li>添加InjectAspect 拦截@InjectSupport进行处理</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化SQL拦截器，支持高级查询功能</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.1.2] 2022.2.20</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>创建gateway-starter包，将gateway相关逻辑提取</li>
                <li>创建authority-starter包，将权限相关功能提取</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化ContextServiceImpl添加相关便捷获取用户及断言、检查的便捷方法</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>v2.1.1] 2022.1.16</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>参数中添加公共邮箱支持</li>
                <li>个人中心添加邮箱校验支持</li>
                <li>用户管理中添加重置密码支持，重置后会给用户发邮件，邮件中包含新的随机密码</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化组织、人员搜索功能，找用户和组织更便捷</li>
                <li>优化授权管理中权限范围为本人、全部、自定义三种</li>
                <li>优化业务日志查询及日志详情查看</li>
                <li>优化业务日志记录内容，优化请求参数、请求响应、异常等信息</li>
                <li>优化HMAC日志记录内容及查看详情功能</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.1.0] 2021.12.19</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>faat: 添加EmalContext上下文信息</li>
                <li>SQL拦截器中添加排除用户委托构建</li>
                <li>SQL拦截器中添加排除组织委托构建</li>
                <li>添加授权码登录模式</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>MBaseServiceImpl中授权码登录模式时更新人和创建人进行标记</li>
                <li>职位设置为自定义时，不再过滤分公司</li>
              </ul>
            </Paragraph>

            <Title level={5} type="warning">
            修复BUG
            </Title>
            <Paragraph type="warning">
              <ul className="snam-li">
                <li>修复登录时日志无法记录操作人中文名称问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.9] 2021.11.21</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>用户授权添加排除用户、排除组织功能</li>
                <li>用户组收钱添加排除用户、排除组织功能</li>
                <li>组织管理中添加用户移动功能，移动到别的组织保留角色</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>组织管理中添加用户、删除用户功能优化</li>
                <li>按钮管理中添加业务数据授权TAG功能优化</li>
                <li>按钮管理中添加业务数据授权TAG引用，多个功能可以引用同一TAG以共享数据权限</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.8] 2021.10.24</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>@ActionConnect中添加tableNameWithAuthInject，解决当有子查询时需要在查询中生效权限时的解决方案</li>
                <li>添加用户组维度的授权，具体功能同用户维度授权</li>
                <li>添加feign实时调用获取用户和当前功能的数据权限封装</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化数据权限校验功能，添加用户组的数据授权验证</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.7] 2021.9.12</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>新增用户TAG机制，在数据字典中添加TAG定义</li>
                <li>用户绑定TAG，可以绑定多个Tag</li>
                <li>添加总是过滤createUser列设置，当设置为false时，用户委托不会对createUser进行过滤</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>可以通过用户TAG自定义配置用户委托列，不同的tag对应不同的用户委托列</li>
                <li>可以通过用户TAG自定义配置组织委托列，不同的tag对应不同的组织委托列</li>
                <li>优化忽略分公司列以TAG形式配置，即那些TAG用户进行忽略分公司列处理</li>
                <li>优化只过滤分公司列以TAG形式配置，即那些TAG用户进行只过滤分公司处理</li>
                <li>优化忽略用户列以TAG形式配置</li>
                <li>优化忽略组织列以TAG形式配置</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.6] 2021.8.15</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>新增PermContext，通过编程方式动态进行忽略用户委托等权限配置</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>用户委托可自定义配置多列</li>
                <li>组织委托可自定义配置多列</li>
                <li>用户自定义配置用户委托列时可通过&quot;表名.列名&quot;指定表名</li>
                <li>用户自定义配置组织委托列时可通过&quot;表名.列名&quot;指定表名</li>
              </ul>
            </Paragraph>
            <Title level={5} type="warning">
            修复BUG
            </Title>
            <Paragraph type="warning">
              <ul className="snam-li">
                <li>修复当用户委托配置为自定义列时无法看到“自己”的数据问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>v2.0.5] 2021.7.18</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加用户委托列可自定义配置功能</li>
                <li>添加组织委托列可自定义配置功能</li>
                <li>添加忽略用户委托配置及功能</li>
                <li>添加忽略组织委托配置功能</li>
                <li>添加只过滤分公司配置功能</li>
                <li>添加忽略分公司机制</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化用户自定义授权时，忽略分公司机制</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.4] 2021.6.20</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>授权功能选择用户时，根据用户角色进行过滤对应功能</li>
                <li>授权功能&quot;全部&quot;、&quot;自定义&quot;时支持生效时间范围</li>
                <li>添加@ActionConnect注解，绑定方法中对应的mapper方法</li>
                <li>@Action与@ActionConnect进行上下文关联</li>
                <li>添加BusinessAuthAspect切面，拦截@Action进行处理</li>
                <li>添加BusinessConnectAspect切面，拦截@ActionConnect进行处理</li>
                <li>添加BusinessAuthContext上下文，存储业务数据权限上下文</li>
                <li>添加MapperAuthContext上下文，存储@ActionConnect关联的mapper方法</li>
                <li>SQL拦截器获取业务权限对应及关联mapper方法拦截</li>
                <li>SQL拦截器构建用户委托功能</li>
                <li>SQL拦截器构建组织委托功能</li>
                <li>SQL拦截器构建公司委托功能</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.3] 2021.5.16</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加@Action直接用来支持方法的数据权限</li>
                <li>添加功能数据权限功能</li>
                <li>功能数据权限关联按钮资源</li>
                <li>功能权限权限针对于某个功能，而不是针对读、写业务范围，业务数据权限更加细粒化</li>
                <li>添加授权功能，对于用户针对某个<mark>功能</mark>进行特殊的组织委托和用户委托</li>
                <li>添加授权功能权限范围：本人、全部、自定义</li>
                <li>实现授权<mark>全部</mark>功能</li>
                <li>实现授权<mark>自定义</mark>功能</li>
                <li>保存授权功能设置的数据</li>
                <li>建立用户与业务数据权限、用户委托、组织委托的关联关系</li>
                <li>添加用户针对某个功能查询用户委托、组织委托功能</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化用户委托、组织委托功能</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.2] 2021.4.18</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加分公司权限过滤，默认过滤分公司</li>
                <li>添加SQL解析连表查询语句功能</li>
                <li>添加SQL解析表名后生成随机别名</li>
              </ul>
            </Paragraph>
            <Title level={5} type="warning">
            修复BUG
            </Title>
            <Paragraph type="warning">
              <ul className="snam-li">
                <li>修复SQL解析后包含用户表导致获取组织委托错误问题</li>
                <li>修复连表查询SQL拦截解析表名错误问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.1] 2021.3.14</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加权限抽象模型，所有权限信息抽象成权限模型</li>
                <li>添加权限上下文，对权限范围解析数据进行保存</li>
                <li>添加权限解析器，对权限范围进行解析</li>
                <li>添加业务权限范围：读权限、写权限</li>
                <li>实现用户职位分配的数据权限，查询本人及组织下属成员</li>
                <li>添加feign获取用户信息</li>
                <li>添加feign获取组织信息</li>
                <li>添加feign获取职位权限范围及业务权限范围信息</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化权限拦截器，拦截服务判断用户权限范围</li>
                <li>优化SQL拦截器，拦截SQL，进行改造拼接、执行</li>
                <li>优化feign写业务日志信息</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v2.0.0] 2021.2.21 全新版本-开始支持数据权限</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 添加用户委托、组织委托机制</li>
                <li> 添加权限作用域机制</li>
                <li> 业务与权限解耦，添加弱依赖机制，通过feign调用获取委托信息</li>
                <li> 职位添加权限范围：本组织、下属、本人</li>
                <li> 添加权限拦截器，拦截识别权限范围</li>
                <li> 添加SQL拦截器，拦截SQL，打印调试</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化查询组织及所有子组织功能</li>
                <li>MBaseServiceImpl保存时自动填充组织功能</li>
                <li>优化feign调用，完善传递信息</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.1.0] 2020.12.27</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 网关添加hmac授权、认证机制</li>
                <li> authority模块hmac认证用户添加、删除等功能支持</li>
                <li> hmac添加IP、时间段有效性检测</li>
                <li> hmac关联用户功能</li>
                <li> hamc关联用户角色进行统一资源认证功能</li>
                <li> hmac认证日志记录</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="warning">
              <ul className="snam-li">
                <li>修复request只能读取开一次请求流的问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.9] 2020.11.22</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 添加数据库、redis密码加密支持，防止明文</li>
                <li> 添加根据命名进行事务传播机制配置</li>
                <li> 添加@ULog注解，添加此注解支持业务日志记录</li>
                <li> 添加@Notwrap注解，添加此注解不进行统一返回类型封装</li>
                <li> 添加Assert断言工具类，不满足条件抛出异常</li>
                <li> 添加Checker工具类，进行统一的判断</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化统一数据返回封装，针对返回类型和方法修饰符及包名进行封装</li>
                <li>分页查询优化，统一分页查询参数封装及返回类型封装</li>
                <li>优化代码命名规范</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.8] 2020.10.18</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 添加email模块，提供发邮件支持</li>
                <li> 添加http模块，提供发送请求支持</li>
                <li> 添加disruptor框架支持，封装点对点消费、点对面消费</li>
                <li> 添加oss模块，提供基于fastdfs的上传、下载、删除等功能支持</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.7] 2020.9.27</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 添加用户的关键字匹配功能</li>
                <li> gatway添加限流支持</li>
                <li> 用户组启用、停用功能</li>
                <li> 添加状态流支持，状态流初始化状态、流转、删除和编辑检测</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化按钮无权限功能</li>
                <li>优化菜单无权限功能</li>
                <li>优化用户角色管理功能，添加用户与用户组角色关联</li>
                <li>优化菜单添加按钮及菜单管理，按钮管理功能</li>
                <li>优化角色分配菜单、按钮，提高性能</li>
                <li>优化获取可分配菜单按钮列表，无角色的不展示</li>
                <li>优化用户分配多个组织功能</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.6] 2020.8.30</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 添加参数启用、停用功能</li>
                <li> 添加职位分配角色功能</li>
                <li> 添加业务日志查询、查看功能</li>
                <li> 添加用户组功能、用户组新增、删除、添加角色、添加组织用户、删除组织用户</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>gateway模块功能认证功能，认证失败处理</li>
                <li>用户资源功能角色关联优化，用户关联角色、用户关联职位、职位关联角色</li>
              </ul>
            </Paragraph>
            <Title level={5} type='warning'>修复BUG</Title>
            <Paragraph type='warning'>
              <ul className="snam-li">
                <li>修复get方法传递/user/{'\u007b'}id模{'\u007d'}式时认证错误问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.5] 2020.8.2</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 添加职位新增、删除、编辑</li>
                <li> 职位关联组织，组织查询职位功能</li>
                <li> 职位关联组织用户功能</li>
                <li> 添加功能认证功能，根据URL来映射功能</li>
                <li> 添加参数管理功能，参数查询，新增，删除</li>
                <li> 添加字典项启用、停用功能</li>
                <li> 添加子字典箱的启用、停用功能</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化角色分配菜单、按钮功能</li>
                <li>优化角色分配用户功能</li>
                <li>优化创建付字典，付字典创建子字典，父子联动问题</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.4] 2020.7.12</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li> 添加角色查询、增加、更新、删除</li>
                <li> 角色的启用、停用、分配用户功能</li>
                <li> 菜单的新增、编辑、删除功能</li>
                <li> 按钮的新增、编辑、删除功能</li>
                <li> 按钮关联菜单功能</li>
                <li> API功能，API关联菜单、按钮</li>
                <li> 创建cache-starter模块，提取缓存功能</li>
                <li> 创建orm-starter模块，提取orm相关功能</li>
                <li> 创建tool模块，提取公共工具类功能</li>
                <li> 添加feign-starter模块，提取feign功能</li>
                <li> 配置异步线程池，进行feign异步调用测试</li>
                <li> feign传递用户信息，错误处理</li>
                <li> gateway路由添加feign转发功能</li>
                <li> 添加feign调用机制，防止feign模拟请求</li>
                <li> 组织中添加公司新建、删除、编辑、新建子部门、编辑、删除子部门</li>
                <li> 组织添加人员功能</li>
                <li> 组织查询所有子部门支持</li>
                <li> 添加角色授权功能</li>
                <li> 添加角色关联组织用户功能</li>
                <li> 添加字典管理功能</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>异步线程池添加TransmittableThreadLocal上下文传递支持</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.3] 2020.6.21</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>创建log-starter模块，将log相关提取到该模块</li>
                <li>新建PointLog工具，用来进行打印埋点日志</li>
                <li>添加业务日志功能，写入调用的url、IP、浏览器等信息</li>
                <li>添加spring listenr监听机制，监听日志发布并写入业务日志</li>
                <li>用户查询、新增、删除、编辑功能</li>
                <li>建立用户的关联关系，与组织、角色、职位关联</li>
                <li>组织查询，关联用户功能</li>
                <li>组织的新增、更新、删除功能</li>
                <li>用户添加组织功能</li>
                <li>用户的激活、停用、启用功能</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li> 网关JwtTokenFilter和AuthorizationFilter添加白名单机制，不拦截登录等请求</li>
                <li> 优化用户表结构，添加手机号，邮箱等信息</li>
                <li> 优化添加用户上下文</li>
                <li> 优化请求上下文</li>
                <li> MBaseServiceImpl中添加mapper2t,mapper2v,mapper方法分别用来进行entity-&gt;dto,dto-&gt;entity,List&lt;entity&gt;-&gt;List&lt;dto&gt;映射</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>v1.0.2] 2020.5.31</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加web-starter模块，抽象Web相关进行封装</li>
                <li>添加拦截器，拦截请求，封装用户上下文、请求上下文</li>
                <li>添加网关认证过滤器AuthorizationFilter用来支持方法认证</li>
                <li>添加非登录测试机制，方便进行调试</li>
                <li>Authority模块添加获取当前用户功能</li>
                <li>添加ActionController获取通用的request/response等请求信息</li>
                <li>添加MBaseModel模型基类，包含审计信息（创建人、更新人、创建时间、更新时间）</li>
                <li>添加dozer支持，用来进行数据转化dto&lt;-&gt;entity</li>
                <li>添加dozer集合转化支持</li>
                <li>添加通用业务异常ServerRuntimeException</li>
                <li>添加异常枚举值，及业务异常抛出机制/捕捉机制</li>
                <li>添加统一返回封装处理</li>
                <li>添加统一异常枚举接口ExceptionEnumable，所有异常枚举类实现此接口，进行统一处理</li>
                <li>添加AOP拦截器，用来拦截service方法执行并打印调试日志</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li> 优化用户登录功能，缓存用户相关信息</li>
                <li> MBaseService中添加通用增删改查方法</li>
                <li> 优化通用保存方法，自动填充审计信息</li>
                <li> 优化通用更新方法，自动填充审计信息</li>
                <li> 优化字符串数据类型转换</li>
                <li> 优化跨域策略</li>
                <li> 优化异常抛出机制，添加message占位符支持，占位符以\{0}、\{1}的方式站位</li>
                <li> gateway 添加BaseFilter，抽象公共方法</li>
              </ul>
            </Paragraph>
          </Timeline.Item>

          <Timeline.Item>
            <Title level={4}>[v1.0.1] 2020.5.10</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>添加gateway模块</li>
                <li>添加网关路由及跳转</li>
                <li>添加登陆、登出，生成jwt token功能</li>
                <li>添加网关授权验证机制</li>
                <li>网关token合法性验证</li>
                <li>网关和授权模块添加异常统一处理</li>
                <li>添加用户获取菜单功能</li>
                <li>gateway中jwt验证后添加当前用户信息 </li>
                <li>authority中获取用户信息并封装</li>
                <li>框架添加机制，防止绕开网关直接访问微服务</li>
                <li>gateway中添加跟踪filter，获取访问用户的IP等信息</li>
                <li>gateway中添加黑名单filter，IP匹配后直接拒绝访问</li>
                <li>添加core-starter公共模块，抽象公共信息进行封装</li>
              </ul>
            </Paragraph>
            <Title level={5} type="success">
              功能优化
            </Title>
            <Paragraph type="success">
              <ul className="snam-li">
                <li>优化logback日志打印</li>
              </ul>
            </Paragraph>
          </Timeline.Item>


          <Timeline.Item>
            <Title level={4}>[v1.0.0] 2020.2.29</Title>
            <Title level={5}>新增功能</Title>
            <Paragraph>
              <ul className="snam-li">
                <li>项目初始化，引入SpringBoot、Spring Cloud</li>
                <li>创建授权模块</li>
                <li>
                  技术选型，添加依赖库，初始化环境配置，初始化配置文件
                </li>
                <li>创建通用Service服务类，通用Controller类</li>
                <li>添加分层结构包，创建数据结构Dto、Entity、Mapper、XML，创建服务类、控制器类</li>
                <li>创建启动类，添加启动类注解支持</li>
                <li>启动项目，调试基本增删改查功能</li>
              </ul>
            </Paragraph>
          </Timeline.Item>
        </Timeline>
      </Card>
    </>
  );
};
