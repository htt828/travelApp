<template>
	<div class="searchContent">
		<van-sticky class="searchArea">
			<van-nav-bar left-arrow title="搜索" @click-left='goBack()'></van-nav-bar>
			<search-content :placehodler='placehodler' @searchInput='searchContent'></search-content>

		</van-sticky>
		<div class="searchTag">
			<p class="note">为了查找结果更精确，请选择要搜索的标签:</p>
			<van-tag v-for="(item,i) in tags" :key='i' round :plain='!item.selected' type="warning" color="#4FC9B4" @click='selectTag(item)'>{{item.name}}</van-tag>
		</div>
		<div class="hotAddress">
			<h6>热门景点</h6>
			<van-grid :column-num='3.4' :clickable='true'>
				<van-grid-item v-for="(item,i) in hotAddress" :key='i' :text="item" @click='searchContent(item)' />
			</van-grid>
		</div>
		<div class="searchResult" ref='searchResult'>
			<travelContent v-for='(item,i) in contents' :key='i' :showContentBottom='true' :contentItem='item'></travelContent>
			<div class="empty" v-show="searchIsEmpty">
				<img src="../../assets/img/noData.png" />
				<p>暂无搜索结果</p>
			</div>
		</div>
		<img v-if="gotop" src="../../assets/goTop.png" class="goTop" @click="goTop" />
	</div>
</template>

<script>
	import travelContent from '../component/content.vue'
	import url from '@/serviceAPI.js'
	import searchContent from '../component/search.vue'
	export default {
		data() {
			return {
				gotop: false,
				searchIsEmpty: false,
				searchInputData: '',
				placehodler: '请输入搜索地点',
				contents: [],
				selecteds: [],
				hotAddress: ['鼓浪屿', '丽江', '长沙', '上海', '武汉', '武汉', '凤凰古城', '张家界', '武功山'],
				tags: [{
						name: '美食',
						value: 3,
						selected: false
					},
					{
						name: '民宿',
						value: 2,
						selected: false
					},
					{
						name: '旅游攻略',
						value: 4,
						selected: false
					},
					{
						name: '旅行的意义',
						value: 1,
						selected: false
					}
				]
			}
		},
		methods: {
			goTop() {
				this.$nextTick(function() {
					setTimeout(() => {
						window.scrollTo({
							"behavior": "smooth",
							"top": 0
						});
					}, 100)
				})
			},
			//处理滚轮事件
			handleScroll(e) {
				let el = document.getElementsByClassName('searchResult')[0]
				let scrolltop = e.target.scrollingElement.scrollTop;
				scrolltop > (el.offsetTop - 102) ? (this.gotop = true) : (this.gotop = false);
			},
			selectTag(item) {
				item.selected = !item.selected
				if (item.selected) {
					this.selecteds.push(item.value)
				} else {
					console.log(this.selecteds)
					this.selecteds.some((item2, i) => {
						if (item2 === item.value) {
							return this.selecteds.splice(i, 1)
						}
					})
				}
				this.searchContent(this.searchInputData)
			},
			searchContent(value) {
				let sticktHeight = document.getElementsByClassName('van-sticky')[0].style.height
				let el = document.getElementsByClassName('searchResult')[0]
				let clientHeight = document.documentElement.clientHeight || document.body.clientHeight
				this.$nextTick(function() {
					setTimeout(() => {
						document.getElementsByClassName('searchContent')[0].style.minHeight = el.offsetTop + clientHeight - 100 +
							'px'
						window.scrollTo({
							"behavior": "smooth",
							"top": el.offsetTop - 100 
						});
					}, 100)
				})
				this.searchInputData = value
				console.log(value)
				this.$axios.post(url.searchContent, {
					sort: this.selecteds,
					address: value
				}).then(res => {
					if (res.data.code === 200) {
						this.contents = res.data.data
					}
					if (this.contents.length === 0) {
						this.searchIsEmpty = true
					} else {
						this.searchIsEmpty = false
					}
				})
			}
		},
		mounted() {
			// 此处true需要加上，不加滚动事件可能绑定不成功
			window.addEventListener("scroll", this.handleScroll, true);
		},
		components: {
			searchContent,
			travelContent
		}
	}
</script>

<style scoped="scoped">
	.goTop {
		position: fixed;
		bottom: 2rem;
		right: 1rem;
	}

	.empty {
		background: white;
		text-align: center;
		margin-top: 40%;
	}

	.searchResult {
		padding-top: 10px;
		border-top: 1px solid #EEEEEE;
	}

	.van-grid-item {
		margin: .6rem;
		margin-left: 0;
	}

	.van-button--normal {
		padding: 0 7px;
		border-radius: 10px;
		margin-bottom: .6rem;
	}

	h6 {
		margin: 0;
		margin-bottom: .6rem;
	}

	.hotAddress {
		padding: 1rem;
	}

	.searchContent {
		background: white;
	}

	.searchTag {
		padding: 1rem;
		border-bottom: 1px solid #EEEEEE;
	}

	.note {
		margin: 0;
		font-size: .7rem;
		color: #999999;
		margin-bottom: 1rem;
	}

	.van-tag--round {
		padding: .3rem;
		margin: .2rem;
		font-size: .7rem;
	}
</style>
