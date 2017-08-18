<template>
  <div class="container">
    <header>
      <img src="./assets/mlogo.png" alt="明略数据">
      <span class='header-title'>webook</span>
    </header>
    <div class='content'>
      <h3 class='article-title'>
        {{content.contentTitle}}
        <p>浏览量 {{visitors + 1}}</p>
      </h3>
      <div class='note-item flex-box animated' v-bind:class="note.animate" v-for="note in content.notes">
        <div class="note-item-pic" v-if="note.file">
          <img v-bind:src="'http://139.129.252.72:8000/webook/400/'+note.file"
          v-bind:_src="'http://139.129.252.72:8000/webook/'+note.file" 
          alt="明略数据" @click='imgView'>
        </div>
        <div class='note-item-text' v-html="note.text"></div>
      </div>
      <div class="scroll-top animated" v-bind:class="{'fadeIn':showScrollTop}" @click="scrollTop">
        <i class="el-icon-arrow-up"></i>
      </div>
    </div>
    <el-dialog v-model="dialogVisible" size="full" class="image-viewer">
      <img :src="dialogImageUrl" alt="">
    </el-dialog>
  </div>
</template>

<script>
export default {
  data () {
    return {
      dialogVisible: false,
      dialogImageUrl: '',
      content: {
        contentTitle:'',
        notes:[]
      },
      showScrollTop:false,
      visitors: 0
    }
  },
  methods: {
    imgView: function() {
      this.dialogImageUrl = event.currentTarget.getAttribute('_src');
      this.dialogVisible = true;
    },
    scroll: function() {
      var top = document.body.scrollTop;
      if(top >= 200) {
        this.showScrollTop = true;
      }else{
        this.showScrollTop = false;
      }
    },
    scrollTop: function() {
      document.body.scrollTop = 0;
    }
  },
  mounted: function () {
    var key = window.location.hash.split('#')[1];
    var me = this;
    fetch('/apis/article/id/'+key).then(function(response) {
      return response.json()
    }).then(function(json) {
      me.content = json;
      //console.log('parsed json', json)
    }).catch(function(ex) {
      me.$message.error('系统出错啦');
      console.log('parsing failed', ex)
    })
    fetch('/apis/visitors/id/'+key).then(function(response) {
      return response.json()
    }).then(function(json) {
      me.visitors = json.visitors;
      //console.log('parsed json', json)
    }).catch(function(ex) {
      me.$message.error('系统出错啦');
      console.log('parsing failed', ex)
    })
    window.addEventListener('scroll', this.scroll)
  },
}
</script>

