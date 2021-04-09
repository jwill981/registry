<template>
  <div class="home">
    <h1>View All Registries</h1>
    <h2>Select a Couple</h2>
    
    <div class="couples">
      <button
        :class="{ selected: active(couple) }"
        v-for="couple in couples"
        :key="couple.id"
        @click="selectCouple(couple)"
      >
        {{ couple.name }}
      </button>
    </div>

  
      <h3 v-show="items.length == 0 && couple">This couple has no items on their registry!<br>Tell them to add some!</h3>
      <div v-if="items.length > 0 && couple" class="controls">
        <hr>
        <button @click="showAll()">Show All</button>
        <button @click="showNeed()">Show Still Need</button>
        <button @click="showPurchased()">Show Purchased</button>
      </div>


    <div class="registry" :v-if="couple">

      <div class="item" v-for="item in filteredItems" :key="item.id" >
        <h3>{{item.name}}</h3>
        <p>{{item.description}}</p>
        <input type="checkbox" v-model="item.bought" @click="boughtItem(item)" />
        <label>Purchased</label><img :src="item.path" />
      </div>
    </div>

  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: "Home",
  data() {
    return {
      couples: [],
      couple: null,
      items: [],
      show: 'all'
    };
  },
  created() {
    this.getCouples();
  },
  computed: {
    activeItems() {
      return this.items.filter(item => {
        return !item.bought;
      });
    },
    filteredItems() {
      if (this.show === 'need')
        return this.items.filter(item => {
          return !item.bought;
        });
      if (this.show === 'bought')
        return this.items.filter(item => {
          return item.bought;
        });
      return this.items;
    },
  },
  methods: {
    async boughtItem(item) {
      try {
        await axios.put(`api/items/${item._id}`);
        this.getItems();
        return true;  
      } catch (error) {
        //console.log(error);
      }
    },
    async getCouples() {
      try {
        const response = await axios.get("api/couples");
        this.couples = response.data;
        return true;
      } catch (error) {
        //console.log(error);
      }
    },
    async selectCouple(couple) {
      this.couple = couple;
      this.getItems();
    },
    async getItems() {
      try {
        const response = await axios.get(`api/couples/${this.couple._id}/items`);
        this.items = response.data;
      } catch (error) {
        //console.log(error);
      }
    },
    active(couple) {
      return (this.couple && couple._id === this.couple._id);
    },
    showAll() {
      this.show = 'all';
    },
    showNeed() {
      this.show = 'need';
    },
    showPurchased() {
      this.show = 'bought';
    },
  },
};
</script>

<style scoped>

.registry{
  padding: 20px;
  column-gap: 1.5em;
}

hr {
  margin-bottom: 20px;
}

.controls {
  margin-top: 30px;
}

/* Masonry */
*,
*:before, 
*:after {
  box-sizing: inherit;
}

.item {
  margin: 0 0 1.5em;
  display: inline-block;
  width: 100%;
  border: 2px solid black;
  border-radius: 6%;
}

.item img {
  max-width: 200px;
  padding: 25px;
}

button {
  margin-top: 15px;
  margin-right: 10px;
  font-size: 1em;
  margin: 5px;
}

button:focus {
  background-color: #7eb0da;
}


/* Masonry on large screens */
@media only screen and (min-width: 1370px) {
  .registry {
    column-count: 5;
  }

  .item img {
    padding: 35px;
  }
}

/* Masonry on medium-sized screens */
@media only screen and (max-width: 1369px) and (min-width: 1100px) {
  .registry {
    column-count: 4;
  }
}

/* Masonry on small screens */
@media only screen and (max-width: 1099px) and (min-width: 843px) {
  .registry {
    column-count: 3;
  }
}

@media only screen and (max-width: 842px) and (min-width: 470px) {
  .registry {
    column-count: 2;
  }

  .item img {
    max-width: 150px;
    padding: 35px;
  }
}

@media screen and (max-width: 469px) {
  .registry {
    column-count: 1;
  }

  .item img {
    max-width: 150px;
    padding: 45px;
  }
}

</style>
