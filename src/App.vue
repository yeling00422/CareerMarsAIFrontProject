<template>
  <div class="app">
    <div class="particles">
      <span v-for="i in 15" :key="i" class="particle" :class="'p' + i"></span>
    </div>

    <!-- 服务条款 -->
    <div class="modal-mask" v-if="showDeal">
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-title">服务条款与用户协议</span>
                <button class="modal-close" @click="showDeal = false">×</button>
            </div>
            <div class="modal-body deal-page">
                <!-- 主标题 -->
                <div class="main-title">
                服务条款与用户协议
                </div>
                <!-- 引言 -->
                <div class="intro-text">
                欢迎注册、登录并使用职涯星平台（以下简称“本平台”或“职涯星”）提供的服务（以下简称“本服务”或“服务”）。请您仔细阅读以下全部内容（特别是粗体标注的内容）。
                </div>
                <!-- 1. 协议条款的确认和接纳 -->
                <div class="section">
                <div class="section-title">1. 协议条款的确认和接纳</div>
                <div class="subsection">
                    <div class="subsection-content">
                    <strong>1.1</strong> 本协议是您与职涯星之间关于服务的条款，内容包括本协议正文、本协议明确援引的其他协议及已经发布的或将来可能发布的各类协议和规则。所有协议内容为本协议不可分割的组成部分，与本协议正文具有同等法律效力。除另行明确声明外，您使用服务的行为将受本协议约束。
                    </div>
                </div>
                <div class="subsection">
                    <div class="subsection-content">
                    <strong>1.2</strong> 如您选择“点击同意”本协议或者以其他方式开始使用服务，即表示已经与职涯星达成协议，并自愿接受本协议的所有内容。您确认，您应当具备中华人民共和国法律规定的与您行为相适应的民事行为能力。若您不具备前述主体资格或您是未满十八周岁的未成年人，请在您的监护人的陪同下阅读本服务条款，并在取得他们对您使用服务的行为以及对本服务条款的同意之后，使用本服务；职涯星公司在依据法律规定或本协议约定要求您承担责任时，有权向您的监护人追偿。
                    </div>
                </div>
                <div class="subsection">
                    <div class="subsection-content">
                    <strong>1.3</strong> 职涯星有权根据法律规范及运营的合理需要，不断修改和完善本协议，并在本平台公告。如您继续使用服务，即意味着同意并自愿遵守修改后的协议条款，抑或您有权终止使用。
                    </div>
                </div>
                </div>
                <!-- 2. 定义 -->
                <div class="section">
                <div class="section-title">2. 定义</div>
                <div class="definition-list">
                    <div class="definition-item"><strong>2.1 您：</strong>指注册帐号并经审核同意后，在职涯星上观看、学习课程的用户。</div>
                    <div class="definition-item"><strong>2.2 职涯星平台：</strong>指由上海职涯星商务咨询有限公司推出的在线教育平台，包括但不限于 web 端及其各移动端。</div>
                    <div class="definition-item"><strong>2.3 课程：</strong>指由职涯星提供的，在平台上陈列、展示、供用户观看、学习的视频、语音、文字、图片、链接等课程作品/制品。</div>
                    <div class="definition-item sub-item"><strong>2.3.1 免费课程：</strong>指无偿提供的，供用户免费观看、使用的课程。</div>
                    <div class="definition-item sub-item"><strong>2.3.2 收费课程：</strong>指有偿提供的，供用户付费观看、使用的课程。</div>
                    <div class="definition-item"><strong>2.4 证书服务：</strong>指职涯星向完成指定课程学习并完成课程考核的用户有偿提供课程证书。</div>
                </div>
                </div>

                <!-- 3. 帐号注册与使用 -->
                <div class="section">
                <div class="section-title">3. 帐号注册与使用</div>
                <div class="subsection" v-for="(item, index) in accountRules" :key="index">
                    <div class="subsection-content">
                    <strong>{{ item.number }}</strong> {{ item.text }}
                    </div>
                </div>
                </div>
                
                <!-- 4. 数据 -->
                <div class="section">
                    <div class="section-title">4. 数据</div>
                    <div class="subsection-content">
                        在法律法规允许的范围内，用户同意帐号所有权，以及与注册、使用帐号相关的服务数据和记录，包括但不限于所有注册、登录、消费记录和相关的使用统计数据，归职涯星公司所有。除非另有证明，职涯星储存在其服务器上的数据是您使用服务的唯一有效证据。
                    </div>
                </div>

                <!-- 5. 使用规则 -->
                <div class="section">
                    <div class="section-title">5. 使用规则</div>
                    <div class="subsection" v-for="(rule, index) in usageRules" :key="index">
                        <div class="subsection-title">{{ rule.title }}</div>
                        <div class="subsection-content" v-html="rule.content"></div>
                    </div>
                </div>

                <!-- 6. 服务收费 -->
                <div class="section">
                    <div class="section-title">6. 服务收费</div>
                    <div class="subsection" v-for="(item, index) in paymentRules" :key="index">
                        <div class="subsection-content">
                            <strong>{{ item.number }}</strong> {{ item.text }}
                        </div>
                    </div>
                </div>

                <!-- 7. 隐私政策 -->
                <div class="section">
                    <div class="section-title">7. 隐私政策</div>
                    <div class="subsection-content">
                        尊重用户隐私是职涯星的一项基本政策。职涯星公司将按照职涯星上公布的《职涯星隐私政策》收集、存储、使用、披露和保护您的个人信息，请您完整阅读上述隐私政策，以帮助您更好地保护您的个人信息。
                        <br><br>
                        如您是未满18周岁的未成年人，请您通知您的监护人共同阅读并确认《职涯星未成年人个人信息保护规则及监护人须知》，并在您使用服务、提交个人信息之前，务必寻求他们的同意和指导。
                    </div>
                </div>

                <!-- 8. 其他约定 -->
                <div class="section">
                    <div class="section-title">8. 其他约定</div>
                    <div class="subsection" v-for="(item, index) in otherClauses" :key="index">
                        <div class="subsection-content">
                            <strong>{{ item.number }}</strong> {{ item.text }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- 隐私协议 -->
    <div class="modal-mask" v-if="showHide">
        <div class="modal-content">
            <div class="modal-header">
                <span class="modal-title">职涯星注册及隐私保护指引</span>
                <button class="modal-close" @click="showHide = false">×</button>
            </div>
            <div class="modal-body hide-page">
            <!-- 主标题 -->
            <div class="main-title">
                职涯星注册及隐私保护指引
            </div>

            <!-- 引言 -->
            <div class="intro-text">
                欢迎使用上海职涯星商务咨询有限公司提供的 CareerMars 职涯星服务。我们将通过《职涯星注册及隐私保护指引》（“本指引”）向您进一步细化说明您在使用职涯星时我们收集、使用、存储和共享个人信息的情况，以及您所享有的相关权利等事宜。
            </div>

            <!-- 要点列表 -->
            <div class="highlight-list">
                <div class="highlight-item">• 为了向您提供服务，我们需要收集您的个人信息、登录日志等信息。</div>
                <div class="highlight-item">• 为更好地保护未成年人身心健康，促使未成年人健康上网，最大限度防止未成年人冒用他人身份信息，我们可能针对部分用户启用实名验证。</div>
                <div class="highlight-item">• 您可以根据本指引所述管理您的个人信息以及相关授权。</div>
                <div class="highlight-item">• 我们采用多方位的安全保护措施，以确保对您的个人信息保护处于合理的安全水平。</div>
            </div>

            <div class="detail-link">
                您可以通过阅读完整版《职涯星注册及隐私保护指引》，了解个人信息类型与用途的对应关系等更加详尽的个人信息处理规则。
            </div>

            <!-- 1. 我们收集的信息 -->
            <div class="section">
                <div class="section-title">1. 我们收集的信息</div>
                <div class="section-content">
                在您使用职涯星服务的过程中，职涯星会按照如下方式收集您在使用服务时主动提供的或因为使用服务而产生的信息，用以向您提供、优化我们的服务以及保障您的账户安全。
                </div>

                <div class="subsection">
                <div class="subsection-title">1.1</div>
                <div class="subsection-content">
                    当您注册或使用职涯星服务时，我们会收集您的网络身份标识信息及个人常用设备信息，用于标记您为职涯星的用户。如果您使用实名手机号、微信、QQ 及（或）我们认可的其他账号（以下称“第三方账号”）关联登录职涯星的，我们会收集您实名手机号、微信、QQ 及第三方账号的唯一标识、头像、昵称，用于保存您的登录信息，以便您在不同设备登录。
                    <br><br>
                    如果您使用实名手机号、微信、QQ 及（或）第三方账号作为账号关联登录职涯星的，为了更好地向您提供服务，我们会收集您的实名手机号、QQ 号码、微信账号以及第三方账号涉及的唯一标识、昵称、头像、好友关系以及您授权的其他信息，以及您在职涯星中的相关操作信息进行使用，并可向您本人或其他用户或好友展示。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">1.2</div>
                <div class="subsection-content">
                    为满足相关法律法规政策及相关主管部门的要求，职涯星用户需进行实名认证以继续使用和享受职涯星。我们会在获得您同意或您主动提供的情况下收集您的实名身份信息（包括姓名、身份证号、照片等信息），该信息属于敏感信息，拒绝提供实名身份信息可能会导致您无法登录职涯星或在使用职涯星过程中受到相应限制。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">1.3</div>
                <div class="subsection-content">
                    为保障您正常使用我们的服务，维护账号基础功能的正常运行，优化产品性能并保障您的账号安全，我们会收集您的设备 ID、设备名称、设备类型和版本、系统版本、IP 地址、设备识别符（如 IMEI、IMSI、MAC 地址）、应用 ID、网络类型等信息。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">1.4</div>
                <div class="subsection-content">
                    当您使用职涯星服务时，我们会收集您的日志信息，例如登录日志、物品日志、交友记录等，以便您能够在客户端查看您的历史记录，同时用于运营统计分析、客服投诉处理及其他网络安全分析，并为提升您的网络体验，我们可能把前述信息同步至后续版本或您正在使用的我们提供的其他产品中。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">1.5</div>
                <div class="subsection-content">
                    当您使用职涯星产品的消费功能时，我们会收集您的充值记录、消费记录等信息，以便您查询您的交易记录，同时尽最大程度保护您的虚拟物品安全。充值记录、消费记录属于敏感信息，收集上述信息为实现职涯星产品的消费功能所必须，否则将无法完成交易。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">1.6</div>
                <div class="subsection-content">
                    根据相关法律法规及国家标准，以下情形中，我们可能会收集、使用您的相关个人信息无需征求您的授权同意：
                    <br><br>
                    1）与国家安全、国防安全等国家利益直接相关的；与公共安全、公共卫生、公共知情等重大公共利益直接相关的；
                    <br><br>
                    2）与犯罪侦查、起诉、审判和判决执行等直接相关的；
                    <br><br>
                    3）出于维护您或其他个人的生命、财产、声誉等重大合法权益但又很难得到本人同意的；
                    <br><br>
                    4）所收集的个人信息是您自行向社会公众公开的；
                    <br><br>
                    5）从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道；
                    <br><br>
                    6）根据您要求签订和履行合同所必需的；
                    <br><br>
                    7）用于维护所提供的产品或服务的安全稳定运行所必需的，例如发现、处置产品或服务的故障；
                    <br><br>
                    8）为开展合法的新闻报道所必需的；
                    <br><br>
                    9）出于公共利益开展统计或学术研究所必要，且其对外提供学术研究或描述的结果时，对结果中所包含的个人信息进行去标识化处理的；
                    <br><br>
                    10）法律法规规定的其他情形。
                </div>
                </div>
            </div>

            <!-- 信息的存储 -->
            <div class="section">
                <div class="section-title">信息的存储</div>

                <div class="subsection">
                <div class="subsection-title">1.7</div>
                <div class="subsection-content">
                    我们会通过安全的方式存储您的信息，包括本地存储（例如利用 APP 进行数据缓存）、数据库和服务器日志。
                    <br><br>
                    一般情况下，我们只会在为实现服务目的所必需的时间内或法律法规规定的条件下存储您的个人信息。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">1.8</div>
                <div class="subsection-content">
                    我们会按照法律法规规定，将境内收集的用户个人信息存储于中国境内。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">1.9</div>
                <div class="subsection-content">
                    当我们的产品或服务发生停止运营的情况时，我们将根据相关法律法规规定进行公告通知，并依法保障您的合法权益。
                </div>
                </div>
            </div>

            <!-- 信息安全 -->
            <div class="section">
                <div class="section-title">2. 信息安全</div>

                <div class="subsection">
                <div class="subsection-title">2.1</div>
                <div class="subsection-content">
                    我们努力为用户的信息安全提供保障，以防止信息的泄露、丢失、不当使用、未经授权访问和披露等。我们使用多方位的安全保护措施，以确保用户的个人信息保护处于合理的安全水平，包括技术保护手段、管理制度控制、安全体系保障等诸多方面。我们采用业界领先的技术保护措施。我们使用的技术手段包括但不限于防火墙、加密（例如 SSL）、去标识化或匿名化处理、访问控制措施等。此外，我们还会不断加强安装在您设备端的软件的安全能力。例如，我们会在您的设备本地完成部分信息加密工作，以巩固安全传输；我们会了解您设备安装的应用信息和运行的进程信息，以预防病毒、木马等恶意程序。
                    <br><br>
                    我们建立了保障个人信息安全专门的管理制度、流程和组织。例如，我们严格限制访问信息的人员范围，要求他们遵守保密义务并进行审计，违反义务的人员会根据规定进行处罚。我们也会审查该管理制度、流程和组织，以防未经授权的人员擅自访问、使用或披露用户的信息。
                    <br><br>
                    我们建议您在使用产品和服务时充分注意对个人信息的保护，我们也会提供多种安全功能来协助您保护自己的个人信息安全。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">2.2</div>
                <div class="subsection-content">
                    若发生个人信息泄露等安全事件，我们会启动应急预案，阻止安全事件扩大。安全事件发生后，我们会以公告、推送通知或邮件等形式告知您安全事件的基本情况、我们即将或已经采取的处置措施和补救措施，以及我们对您的应对建议。如果难以实现逐一告知，我们将通过公告等方式发布警示。
                </div>
                </div>
            </div>

            <!-- 我们如何使用信息 -->
            <div class="section">
                <div class="section-title">3. 我们如何使用信息</div>

                <div class="subsection">
                <div class="subsection-title">3.1</div>
                <div class="subsection-content">
                    我们会根据我们收集的信息向您提供各项功能与服务，包括基础功能、消费功能等；
                    <br><br>
                    我们会根据您使用职涯星产品的频率和情况、故障信息、性能信息等分析我们产品的运行情况，以确保服务的安全性，并优化我们的产品，提高我们的服务质量。我们不会将我们存储在分析软件中的信息与您提供的个人身份信息相结合。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">3.2</div>
                <div class="subsection-content">
                    我们将会在本指引所涵盖的用途内使用收集的信息。如我们使用您的个人信息，超出了与收集时所声称的目的及具有直接或合理关联的范围，我们将在使用您的个人信息前，再次向您告知并征得您的明示同意。
                </div>
                </div>
            </div>

            <!-- 对外提供 -->
            <div class="section">
                <div class="section-title">4. 对外提供</div>

                <div class="subsection">
                <div class="subsection-title">4.1</div>
                <div class="subsection-content">
                    除本指引规定的情形之外，我们不会主动共享、提供或转让您的个人信息至的第三方，如存在其他共享、提供或转让您的个人信息或您需要我们将您的个人信息共享、提供或转让至第三方情形时，我们会直接或间接通过该第三方征得您对上述行为的明示同意。
                    <br><br>
                    我们不会向合作伙伴分享可用于识别您个人身份的信息（例如您的姓名或电子邮件地址），除非您明确授权。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">4.2</div>
                <div class="subsection-content">
                    除本指引另有规定外，我们不会对外公开披露所收集的个人信息。如必须公开披露时，我们会向您告知此次公开披露的目的、披露信息的类型及可能涉及的敏感信息，并征得您的明示同意。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">4.3</div>
                <div class="subsection-content">
                    随着我们业务的持续发展，我们有可能进行合并、收购、资产转让等交易，我们将告知您相关情形，按照法律法规及不低于本指引所要求的标准继续保护或要求新的控制者继续保护您的个人信息。
                </div>
                </div>

                <div class="subsection">
                <div class="subsection-title">4.4</div>
                <div class="subsection-content">
                    根据相关法律法规及国家标准，以下情形中，我们可能会共享、转让、公开披露个人信息无需事先征得您的授权同意：
                    <br><br>
                    1）与国家安全、国防安全直接相关的；
                    <br><br>
                    2）与公共安全、公共卫生、重大公共利益直接相关的；
                    <br><br>
                    3）与犯罪侦查、起诉、审判和判决执行等直接相关的；
                    <br><br>
                    4）出于维护个人信息主体或其他个人的生命、财产等重大合法权益但又很难得到本人同意的；
                    <br><br>
                    5）个人信息主体自行向社会公众公开个人信息的；
                    <br><br>
                    6）从合法公开披露的信息中收集个人信息的，如合法的新闻报道、政府信息公开等渠道。
                </div>
                </div>
            </div>

            <!-- 您的权利 -->
            <div class="section">
                <div class="section-title">5. 您的权利</div>
                <div class="section-content">
                在您使用职涯星服务期间，我们可能会视产品具体情况为您提供相应的操作设置，以便您可以查询、删除、更正或撤回您的相关个人信息，您可参考相应产品的具体指引进行操作。此外，我们还设置了投诉举报渠道，您的意见将会得到及时的处理。
                </div>
            </div>

            <!-- 变更 -->
            <div class="section">
                <div class="section-title">6. 变更</div>
                <div class="section-content">
                我们可能会适时对本指引进行修订。当本指引的条款发生变更时，我们会在版本更新时以适当的方式向您提示变更后的指引。请您仔细阅读变更后的隐私保护指引或指引内容，您继续使用职涯星表示您同意我们按照更新后的隐私保护指引收集、处理或使用您的个人信息。
                </div>
            </div>

            <!-- 未成年人保护 -->
            <div class="section">
                <div class="section-title">7. 未成年人保护</div>
                <div class="section-content">
                我们高度重视未成年人个人信息的保护问题，并持续探索更新的未成年人个人信息保护方式。为了进一步提高实名认证的精准度，最大限度防止未成年人冒用他人身份信息，我们可能针对部分用户在特定场景下（如进行有关充值、消费或交易时）启用人脸识别验证。
                <br><br>
                上述人脸识别验证主要是将用户真实面部信息与公安权威数据平台数据源进行比对，如二者比对结果一致，即成功通过认证。人脸识别的相关验证数据，在加密后仅用于与公安权威数据平台进行比对，我们不会对其留存。
                </div>
            </div>

            <!-- 联系我们 -->
            <div class="section">
                <div class="section-title">8. 联系我们</div>
                <div class="section-content">
                当您有其他的投诉、建议、未成年人个人信息相关问题时，请通过在线客服与我们联系。您也可以将您的问题发送至 seven07@careermars.org。
                </div>
            </div>

            </div>
        </div>
    </div>
    <router-view/>
    <img src="./assets/img/上面固定栏.png" class="logo" />
  </div>
</template>

<script>
import axios from 'axios';
import { MessageBox } from 'element-ui';

export default {
  name: 'App',
  data() {
    return {
      pendingRequests: new Map(),   // ✅ 请求防重
      hasShownError: false,         // ✅ 弹窗防重
      showDeal: false,
      showHide: false
    };
  },

  created() {
    this.setupAxiosInterceptor();
    this.resetErrorStateOnRouteChange();
  },
  mounted() { 
    this.$root.dealAndHide = this.$refs.dealAndHide
  },
  methods: {
    /** ✅ Axios 拦截器：防止刷新后出现两次弹窗 */
    setupAxiosInterceptor() {
      // 请求拦截
      axios.interceptors.request.use(config => {
        const key = `${config.url}_${JSON.stringify(config.params)}`;
        if (this.pendingRequests.has(key)) {
          return Promise.reject({ __CANCEL__: true });
        }
        this.pendingRequests.set(key, true);
        return config;
      });

      // 响应拦截
      axios.interceptors.response.use(
        response => {
          const key = `${response.config.url}_${JSON.stringify(response.config.params)}`;
          this.pendingRequests.delete(key);
          this.hasShownError = false; // ✅ 成功后重置
          return response;
        },
        error => {
          if (error.__CANCEL__) return Promise.reject(error);

          // ✅ 只弹一次 MessageBox
          if (!this.hasShownError) {
            this.hasShownError = true;
            MessageBox.confirm(
              '请求异常，是否重新加载？',
              '提示',
              {
                confirmButtonText: '重新加载',
                cancelButtonText: '返回首页',
                type: 'warning'
              }
            ).then(action => {
              if (action === 'confirm') {
                window.location.reload();
              }
            }).catch(() => {
              this.$router.push('/');
            });
          }
          return Promise.reject(error);
        }
      );
    },

    /** ✅ 路由变化时重置弹窗状态 */
    resetErrorStateOnRouteChange() {
      this.$router.afterEach(() => {
        this.hasShownError = false;
        this.pendingRequests.clear();
      });
    }
  }
};
</script>

<style>

html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh; 
  background-image: url('./assets/img/第一页白背景.png');
  background-size: cover;
}

.logo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  pointer-events: none;
}

.center-dialog {
  position: fixed;
  top: 40%;
  left: 5%;
  width: 90vw  !important;
}

@keyframes slideInDown {
  from { opacity: 0; transform: translateY(-4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(4rem); }
  to   { opacity: 1; transform: translateY(0); }
}

@keyframes shimmer {
  0%   { background-position: -200% center; }
  100% { background-position: 200% center; }
}

@keyframes cardGlow {
  0%, 100% { box-shadow: 0 0 1rem rgba(0, 245, 212, 0.2); }
  50%       { box-shadow: 0 0 3rem rgba(0, 245, 212, 0.6), 0 0 6rem rgba(0, 245, 212, 0.2); }
}

@keyframes floatBubble {
  0%   { transform: translateY(0) scale(1); opacity: 0.7; }
  50%  { opacity: 0.3; }
  100% { transform: translateY(-120vh) scale(0.3); opacity: 0; }
}
.particles { position: fixed; inset: 0; pointer-events: none; z-index: 0; }
.particle { position: absolute; bottom: -5rem; border-radius: 50%; background: radial-gradient(circle, rgba(0, 245, 212, 0.9), rgba(0, 245, 212, 0.1)); animation: floatBubble linear infinite; }
.p1  { width:2rem;   height:2rem;   left:5%;  animation-duration:7s;  animation-delay:0s;   }
.p2  { width:3rem;   height:3rem;   left:15%; animation-duration:9s;  animation-delay:1s;   }
.p3  { width:1.5rem; height:1.5rem; left:25%; animation-duration:6s;  animation-delay:2s;   }
.p4  { width:4rem;   height:4rem;   left:35%; animation-duration:11s; animation-delay:0.5s; }
.p5  { width:2rem;   height:2rem;   left:45%; animation-duration:8s;  animation-delay:3s;   }
.p6  { width:3.5rem; height:3.5rem; left:55%; animation-duration:10s; animation-delay:1.5s; }
.p7  { width:1.5rem; height:1.5rem; left:65%; animation-duration:7s;  animation-delay:4s;   }
.p8  { width:2.5rem; height:2.5rem; left:75%; animation-duration:9s;  animation-delay:2s;   }
.p9  { width:3rem;   height:3rem;   left:85%; animation-duration:6s;  animation-delay:0.8s; }
.p10 { width:2rem;   height:2rem;   left:92%; animation-duration:8s;  animation-delay:3.5s; }
.p11 { width:4.5rem; height:4.5rem; left:10%; animation-duration:12s; animation-delay:2.5s; }
.p12 { width:1.8rem; height:1.8rem; left:30%; animation-duration:7.5s;animation-delay:5s;   }
.p13 { width:2.5rem; height:2.5rem; left:50%; animation-duration:9.5s;animation-delay:1s;   }
.p14 { width:3rem;   height:3rem;   left:70%; animation-duration:8.5s;animation-delay:4.5s; }
.p15 { width:2rem;   height:2rem;   left:88%; animation-duration:7s;  animation-delay:6s;   }



html, body {
  margin: 0;
  padding: 0;
  width: 100%;
  min-height: 100vh;
  background-image: url('./assets/img/第一页白背景.png');
  background-size: cover;
  font-family: "Microsoft YaHei", sans-serif;
}

/* ✅ 弹窗遮罩 */
.modal-mask {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 99999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

/* ✅ 弹窗主体 */
.modal-content {
  width: 100%;
  max-width: 72rem;
  max-height: 85vh;
  background: #fff;
  border-radius: 1.6rem;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: 0 0 4rem rgba(0, 0, 0, 0.3);
}

/* ✅ 弹窗头部 */
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 0.1rem solid #e5e5e5;
  background: #f8f9fa;
}

.modal-title {
  font-size: 3.2rem;
  font-weight: bold;
  color: #222;
}

/* ✅ 关闭按钮（终于看得见） */
.modal-close {
  font-size: 5rem;
  color: #666;
  background: none;
  border: none;
  cursor: pointer;
  line-height: 1;
  padding: 0 1rem;
}
.modal-close:hover {
  color: #ff4757;
}

/* ✅ 弹窗内容区 */
.modal-body {
  flex: 1;
  overflow-y: auto;
  padding: 2rem;
  font-size: 2.8rem;
  line-height: 1.8;
  color: #333;
}

/* ✅ 内容标题 */
.modal-body .section-title {
  font-size: 3rem;
  font-weight: bold;
  margin-top: 3rem;
  color: #000;
}

.modal-body .subsection-title {
  font-size: 2.6rem;
  font-weight: bold;
  margin-top: 2rem;
  color: #444;
}

/* ✅ 保留你原来的动画 */
.particles {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}
</style>