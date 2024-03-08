<template>
  <div>
    <h3>會員ID列表</h3>
  </div>
  <div class="infinite-list-wrapper" style="overflow: auto">
    <ul
      v-infinite-scroll="load"
      class="list"
      :infinite-scroll-disabled="disabled"
    >
      <div v-for="item in listData" :key="item">
        <li v-for="element in item" :key="element" class="list-item">
          {{ element.id }}
        </li>
      </div>
    </ul>
    <p v-if="loading">資料讀取中，請稍候...</p>
    <p v-if="noMore">No more</p>
  </div>
</template>

<script setup>
import { computed, ref, reactive, onMounted } from 'vue';
import { getApiData } from '../api/api';

const listData = ref();
const obj = {};
const listParams = reactive({
	q: 'query',
	page: 1,
	per_page: 10,
	sort: 'created',
	order: 'desc',
});
const listCount = ref(0);
const totalCount = ref(0);
const loading = ref(false);
const noMore = ref(false);
const disabled = computed(() => loading.value || noMore.value);

async function getListData(params) {
	try {
		const { q, page, per_page: perPage, sort, order } = params;
		const url = `https://api.github.com/search/users?q=${q}&page=${page}&per_page=${perPage}&sort=${sort}&order=${order}`;
		const response = await getApiData(url);
	  listCount.value = perPage * page;
		totalCount.value = response.data.total_count;
		noMore.value = listCount.value >= totalCount.value;

		return response.data.items;
	}
	catch (error) {
		throw new Error(error);
	}
}

function setList(values) {
	const [data] = values;
	obj[listParams.page] = data;
	listData.value = obj;
}

onMounted(() => {
	loading.value = true;
	Promise.all([
		getListData(listParams),
	]).then((values) => {
		setList(values);
		setTimeout(() => {
			loading.value = false;
		}, 1500);
	});
});

const load = () => {
	loading.value = true;
	setTimeout(() => {
		listParams.page += 1;
		Promise.all([
			getListData(listParams),
		]).then((values) => {
			setList(values);
			loading.value = false;
		});
	}, 1500);
};
</script>

<style scoped>
.infinite-list-wrapper {
    height: 300px;
    text-align: center;
  }
  .infinite-list-wrapper .list {
    padding: 0;
    margin: 0;
    list-style: none;
  }

  .infinite-list-wrapper .list-item {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    background: var(--el-color-primary-light-9);
    color: var(--el-color-plain);
  }
  .infinite-list-wrapper .list-item + .list-item {
    margin-top: 10px;
  }
</style>