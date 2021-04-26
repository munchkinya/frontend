/*全局路由表*/
/*1.先建vue2.import导入3.路由设置*/
import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Back from '../components/Back'
//后台区域
import Home from '../components/backstage/Home'
import Welcome from '../components/backstage/Welcome'
import Student from '../components/backstage/student/Student'
import SchoolTeacher from '../components/backstage/schoolteacher/SchoolTeacher'
import Roles from "../components/backstage/rulemenu/Roles";
import Permission from "../components/backstage/rulemenu/Permission";
import Import from "../components/backstage/schoolteacher/Import";
import StudentImport from "../components/backstage/student/StudentImport";
import ScoreImport from "../components/backstage/student/ScoreImport";
import Report from "../components/backstage/report/Report";
import TrainingCompany from "../components/backstage/trainingcompany/TrainingCompany";
import TrainingTeacher from "../components/backstage/trainingcompany/TrainingTeacher";
import InternshipCompany from "../components/backstage/internshipcompany/InternshipCompany";
import New from "../components/backstage/news/New";
import InternshipInfo from "../components/backstage/internshipcompany/InternshipInfo";
import Newdetail from "../components/backstage/news/Newdetail";
import Editnews from "../components/backstage/news/Editnews";
import Addnews from "../components/backstage/news/Addnews";

//前台
import Index from '../components/FrontDesk/Index'
import Index_news from '../components/FrontDesk/news/Index_news'
import StudentNews from "../components/FrontDesk/news/StudentNews";
import ToNewDetil from "../components/FrontDesk/news/ToNewDetil";
import PoticeNews from "../components/FrontDesk/news/PoticeNews";
import PriceNews from "../components/FrontDesk/news/PriceNews";
import InterNews from "../components/FrontDesk/news/InterNews";
import Salary from "../components/FrontDesk/allperson/Salary";
import Location from "../components/FrontDesk/allperson/Location";
import GivIntershipScores from "../components/FrontDesk/internshipcompany/GivIntershipScores";
import FeedBack from "../components/FrontDesk/Student/FeedBack";
import GetFeedback from "../components/FrontDesk/SchoolTeacher/GetFeedback";

//每个角色的工作台
import PersonIndex from "../components/FrontDesk/PersonIndex";
import Updatetrainteacher from "../components/FrontDesk/TrainningTeacher/Updatetrainteacher";
import Questionnaire from "../components/FrontDesk/TrainningTeacher/Questionnaire";
import Trainteacherreport from "../components/FrontDesk/TrainningTeacher/Trainteacherreport";
import Studentsubmitdocument from "../components/FrontDesk/Student/Studentsubmitdocument";
import Studentsubmitweekdiary from "../components/FrontDesk/Student/Studentsubmitweekdiary";
import Studentindex from "../components/FrontDesk/allperson/Studentindex";
//后面开始做的，每个角色的工作台
//学生工作台
import PutResume from "../components/FrontDesk/Student/PutResume";
import ManageResume from "../components/FrontDesk/internshipcompany/ManageResume";
import GetStudentResumes from "../components/FrontDesk/allperson/GetStudentResumes";
import GetStudentWeekDiarys from "../components/FrontDesk/allperson/GetStudentWeekDiarys";
import UpdaeInternshipMessage from "../components/FrontDesk/Student/UpdaeInternshipMessage";
import CheckChangeIinterInfo from "../components/FrontDesk/SchoolTeacher/CheckChangeIinterInfo";
import IntershipScore from "../components/FrontDesk/Student/IntershipScore";
import GivIntershipScore from "../components/FrontDesk/SchoolTeacher/GivIntershipScore";
import RankingList from "../components/FrontDesk/allperson/RankingList";
import PublishPriceNews from "../components/FrontDesk/SchoolTeacher/PublishPriceNews";
import PublishInterNews from "../components/FrontDesk/internshipcompany/PublishInterNews";
import PublishStudentNews from "../components/FrontDesk/SchoolTeacher/PublishStudentNews";
import PublishPoticeNews from "../components/FrontDesk/TrainningTeacher/PublishPoticeNews";
import FrontNewsdetail from "../components/FrontDesk/allperson/FrontNewsdetail";
import FrontEditNews from "../components/FrontDesk/allperson/FrontEditNews";
import FrontAddNews from "../components/FrontDesk/allperson/FrontAddNews";

Vue.use(VueRouter);

const router = new VueRouter({
   routes : [
    {
      path: '/',
      redirect: '/back'/*重定向，只要用户访问项目根路径，那就转杠index*/
    },
    {
      path: '/back',
      component: Back
    },
    {
      path: '/login',
      component: Login
    },
       //后台区域
    {
      path: '/home', component: Home,redirect: '/welcome',
        children: [
            {path: '/welcome', component: Welcome},
            {path: '/student', component: Student},//想把学生组件加到home中
            {path: '/schoolteacher', component: SchoolTeacher},
            {path: '/roles', component: Roles},
            {path:'/permission',component:Permission},
            {path:'/stimport',component:Import},
            {path:'/studentimport',component:StudentImport},
            {path:'/scoreimport',component:ScoreImport},
            {path:'/report',component:Report},
            {path:'/trainingteacher',component:TrainingTeacher},
            {path:'/trainingcompany',component:TrainingCompany},
            {path:'/internshipcompany',component:InternshipCompany},
            {path:'/backnew',component:New},
            {path:'/internshipInfo',component:InternshipInfo},
            {path:'/newdetail',name:'newdetail',component:Newdetail},
            {path:'/editnews',name:'editnews',component:Editnews},
            {path:'/addnews',name:'addnews',component:Addnews},

        ]
    },
   {
       path: '/index',
       component: Index,
       meta: {
           keepAlive: true//只要路由里面不写，那就没有公共组件
       }
   },
   {path: '/tonewdetil',name:'tonewdetil',component: ToNewDetil,meta: {keepAlive: true}},
       //前台首页区域
   {
       path: '/index_news',
       component: Index_news,
       redirect: '/studentnews',
       meta: {
           keepAlive: true
       },
       children: [
           {path: '/studentnews',component: StudentNews,meta: {keepAlive: true}},
           {path: '/poticenews',component: PoticeNews,meta: {keepAlive: true}},
           {path: '/pricenews',component: PriceNews,meta: {keepAlive: true}},
           {path: '/internews',component: InterNews,meta: {keepAlive: true}},

       ]
   },
       //前台区域
   {
       path:'/personindex',
       redirect: '/indexwelcome',
       component:PersonIndex,
       children: [
           {path: '/studentindex', component: Studentindex},
           {path: '/studentsubmitdocument', component: Studentsubmitdocument},
           {path: '/studentsubmitweekdiary', component: Studentsubmitweekdiary},
           {path: '/trainteacherreport', component: Trainteacherreport},
           {path: '/updatetrainteacher', component: Updatetrainteacher},
           {path: '/questionnaire', component: Questionnaire},
           {path: '/putResume', component: PutResume},//这里是重新开始写的
           {path: '/manageResume', component: ManageResume},
           {path: '/getstudentresumes', component: GetStudentResumes},
           {path: '/getstudentweekdiarys', component: GetStudentWeekDiarys},
           {path: '/updaeinternshipmessage', component: UpdaeInternshipMessage},
           {path: '/checkchangeinterinfo', component: CheckChangeIinterInfo},
           {path: '/intershipscore', component: IntershipScore},
           {path: '/givintershipscore', component: GivIntershipScore},
           {path: '/givintershipscores', component: GivIntershipScores},
           {path:'/indexwelcome',component:Welcome},
           {path:'/rankinglist',component:RankingList},
           {path:'/publishpricenews',component:PublishPriceNews},
           {path:'/publishpoticenews',component:PublishPoticeNews},
           {path:'/publishstudentnews',component:PublishStudentNews},
           {path:'/publishinternews',component:PublishInterNews},
           {path: '/frontnewsdetail',name:'frontnewsdetail',component: FrontNewsdetail},
           {path: '/fronteditnews',name:'fronteditnews',component: FrontEditNews},
           {path: '/frontaddnews',name:'frontaddnews',component: FrontAddNews},
           {path: '/salary',name:'Salary',component: Salary},
           {path: '/location',name:'Location',component: Location},
           {path: '/feedback',name:'FeedBack',component: FeedBack},
           {path: '/getfeedback',name:'GetFeedback',component: GetFeedback}
       ]
   }
   ]
});


//挂载路由导航守卫，保证必须在登录的前提下访问页面
router.beforeEach((to,from,next) =>{
  //to代表将要访问的路径
  // from表示从那个路径跳转过来
  // next代表放行
  if(to.path==='/back' || to.path==='/' ||to.path==='/index'){//这里或者是为了登录首页
      return next();
  }
  if(from.path==='/back'&&to.path==='/index'){//从背景页直接到首页
      return next();
  }
  //获取token
  const tokenStr=window.sessionStorage.getItem('token');
  //token为空
  if(!tokenStr && to.path !== '/login'){//未登录，强制登录
      return next('/login');
  }
  next()
});
export default router
