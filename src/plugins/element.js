import Vue from 'vue'
import {
	Button,
	Form,
	FormItem,
	Input,
	Message,
	Header,
	Aside,
	Main,
	Footer,
	Container,
	Image,
	Menu,
	Submenu,
	MenuItem,
	Breadcrumb,
	BreadcrumbItem,
	Card,
	Table,
	TableColumn,
	Switch,
	Pagination,
	Dialog,
	MessageBox,
	Tag,
	Tree,
	Row,
	Col,
	Select,
	Option,
	Cascader
} from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Container)
Vue.use(Footer)
Vue.use(Image)
Vue.use(Menu)
Vue.use(Submenu)
Vue.use(MenuItem)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Card)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Switch)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Tag)
Vue.use(Tree)
Vue.use(Row)
Vue.use(Col)
Vue.use(Select)
Vue.use(Option)
Vue.use(Cascader)
Vue.prototype.$message = Message
Vue.prototype.$msgbox = MessageBox;
Vue.prototype.$confirm = MessageBox.confirm;
