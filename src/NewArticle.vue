<template>
  <div class="container">
    <header>
      <img src="./assets/mlogo.png" alt="明略数据">
      <span class='header-title'>webook</span>
      <ul class="header-nav">
        <li><a href='/index.html'>文案管理</a></li><li class="active"><a href='/newArticle.html'>文案添加</a></li>
      </ul>
    </header>
    <div class="content" ref="content">
      <el-input placeholder="请输入标题" v-model="contentTitle">
        <el-select v-model="app" slot="prepend" placeholder="请选择系统">
          <el-option label="三农业务风险分析系统" value="hbpost"></el-option>
          <el-option label="三农行业信息分析系统" value="psbcias"></el-option>
          <el-option label="三农贷款还款预测系统" value="predict"></el-option>
          <el-option label="三农大数据决策系统" value="operation"></el-option>
          <el-option label="报表抓取子系统" value="reportmgr"></el-option>
          <el-option label="调查报告优化录入系统" value="surveyrpt"></el-option>
          <el-option label="智能辅助控件" value="cval"></el-option>
        </el-select>
      </el-input>
      <div class='empty-nots' v-if="emptyNots">
        <p>请先添加图文</p>
      </div>
      <div class='note-item flex-box animated' 
      v-bind:animate="note.animate"
      v-bind:class="note.animate" v-for="note in notes">
        <div class="note-item-pic no-grow">
          <el-tooltip class="item" effect="dark" content="点我更换图片" placement="right">
            <input type="file" class="fileElem" accept="image/jpeg,image/jpg,image/png,image/bmp"
              @change="handleFiles($event)"
            >
            <img v-if="note.file" v-bind:src="'http://139.129.252.72:8000/webook/400/'+note.file" v-bind:_src="note.file" alt="明略数据">
            <img v-if="!note.file" src="./assets/mining.jpg" alt="明略数据">
          </el-tooltip>
        </div>
        <div class='note-item-text' v-html="note.text" contenteditable=true v-on:click="edit"></div>
      </div>
      <div class='note-item flex-box animated' 
        v-bind:class="animate"
        v-bind:animate="animate"
        v-for="animate in animates">
        <div class="note-item-pic no-grow">
          <el-tooltip class="item" effect="dark" content="点我更换图片" placement="right">
            <input type="file" class="fileElem" accept="image/jpeg,image/jpg,image/png,image/bmp"
              @change="handleFiles($event)"
            >
            <img src="./assets/mining.jpg" alt="明略数据">
          </el-tooltip>
        </div>
        <div class='note-item-text' contenteditable=true v-on:click="edit">
          <p class='holder-text'>文字描述</p>
        </div>
      </div>
    </div>
    <div class="aside-right">
      <el-card class="box-card">
        <div slot="header" class="clearfix">
          <el-badge :value="count" class="item">
            <span style="line-height: 36px;">添加图文描述</span>
          </el-badge>
          <el-button style="float: right;" type="default" v-on:click="addNote" icon="plus">添加</el-button>
          <el-button style="float: right;margin-right:15px;" type="primary" 
            icon="check" 
            v-if="!emptyNots" 
            v-on:click="saveNote">
            保存
          </el-button>
        </div>
        <div class='content-layout'>
          <p class='aside-right-title'>布局</p>
          <div class='layout-item flex-box flex-column' 
          v-bind:class="{ active: isColumn }"
          @click="changeLayout('column')">
            <div class="content-layout-pic no-grow">
              <img src="./assets/mining.jpg" alt="明略数据">
            </div>
            <div>
              文字描述信息...
            </div>
          </div>  
          <div class='layout-item flex-box flex-column-reverse'
          v-bind:class="{ active: isColumnReverse }"
          @click="changeLayout('columnReverse')">
            <div class="content-layout-pic no-grow">
              <img src="./assets/mining.jpg" alt="明略数据">
            </div>
            <div>
              文字描述信息...
            </div>
          </div>    
        </div>
        <div class='content-animate'>
          <p class='aside-right-title'>动画效果</p>
          <el-select v-model="selectAnimate" clearable placeholder="请选择动画效果">
            <el-option label="淡入" value="fadeIn"></el-option>
            <el-option label="旋转" value="rotateIn"></el-option>
            <el-option label="弹跳" value="bounceIn"></el-option>
            <el-option label="闪烁" value="flash"></el-option>
            <el-option label="翻转" value="flip"></el-option>
            <el-option label="抖动" value="shake"></el-option>
          </el-select>
          <el-select v-model="selectAnimateDirection" clearable placeholder="请选择动画方向">
            <el-option label="由上到下" value="Down"></el-option>
            <el-option label="由下到上" value="Up"></el-option>
            <el-option label="由左到右" value="Left"></el-option>
            <el-option label="由右到左" value="Right"></el-option>
          </el-select>
        </div>
      </el-card>
     
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      app: '',
      count: 0,
      selectAnimate: '',
      selectAnimateDirection: '',
      contentTitle:'',
      notes: [],
      animates: [],
      emptyNots: true,
      show: true,
      postData:null,
      layout: 'column',
      isColumn: true,
      isColumnReverse: false
    }
  },
  created: function() {
    var anchor = window.location.hash.split('#');
    //console.log(anchor);
    if(anchor.length > 1){
      var key = anchor[1];
      var me = this;
      fetch('/apis/article/id/'+key).then(function(response) {
        return response.json()
      }).then(function(json) {
        me.app = json.app
        me.contentTitle = json.contentTitle;
        me.notes = json.notes;
        if(json.notes.length > 0) {
          me.emptyNots = false;
          me.count = json.notes.length;
        }
        console.log('parsed json', json)
      }).catch(function(ex) {
        me.$message.error('系统出错啦');
        console.log('parsing failed', ex)
      })
    }
  },
  methods: {
    changeLayout(type) {
      this.layout = type;
      if(type=='column'){
        this.isColumn = true;
        this.isColumnReverse = false;
      }else{
        this.isColumn = false;
        this.isColumnReverse = true;
      }
    },
    addNote() {
      var suffix = '';
      if(this.selectAnimate == 'fadeIn' || this.selectAnimate == 'bounceIn'){
        suffix = this.selectAnimateDirection + ' ';
      }
      var animate = this.selectAnimate + suffix + 'flex-' + this.layout;
      this.animates.push(animate);
      this.emptyNots = false;
      this.count++;
    },
    edit() {
      this.show = false;
    },
    saveNote() {
      if(this.select == ''){
        this.$message.error('请选择系统');
      }else if(this.contentTitle == ''){
        this.$message.error('请填写标题');
      }else{
        var els = this.$refs.content.querySelectorAll('div.note-item');
        this.notes = [];
        for(var i = 0; i<els.length; i++) {
          var item = {};
          item.animate = els[i].getAttribute('animate');
          //item.animate = 'flex-column-reverse';
          item.text = els[i].querySelector('.note-item-text').innerHTML;
          item.file = els[i].querySelector('img').getAttribute('_src');
          if(item.text!='<p class="holder-text"><br></p>'){
            this.notes.push(item);
          }
        }
        var article = {
          app: this.app,
          contentTitle: this.contentTitle,
          notes: this.notes
        }
        var anchor = window.location.hash.split('#');
        if(anchor.length > 1) {
          article.id = anchor[1];
        }
        var me = this;
        fetch('/apis/create', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(article)
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          me.$notify({
            title: '成功',
            message: '恭喜您，保存成功！',
            type: 'success'
          });
          Object.assign(me.$data, me.$options.data())
          //console.log('parsed json', json)
        }).catch(function(ex) {
          me.$message.error('保存出错啦');
          console.log('parsing failed', ex)
        })
      }
    },
    handleFiles(event) {
      var file = event.currentTarget.files[0];
      var img = event.currentTarget.nextElementSibling;
      img.src = window.URL.createObjectURL(file);
      img.onload = function() {
        window.URL.revokeObjectURL(this.src);
      }
      var me = this;
      var data = new FormData();
      data.append('file', file)
      //data.append('user', 'hubot')
      fetch('/apis/upload', {
        method: 'POST',
        body: data
      }).then(function(response) {
        return response.json()
      }).then(function(json) {
        img.setAttribute('_src',json[0].name);
        //console.log('parsed json', json)
      }).catch(function(ex) {
        me.$message.error('上传出错啦');
        console.log('parsing failed', ex)
      })
    }
  }
}
</script>

<style>
body {
  font-family: Helvetica, sans-serif;
}
</style>
