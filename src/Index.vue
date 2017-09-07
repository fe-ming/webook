<template>
  <div class="container">
    <header>
      <img src="./assets/mlogo.png" alt="明略数据">
      <span class='header-title'>webook</span>
      <ul class="header-nav">
        <li class="active"><a href='/index.html'>文案管理</a></li><li><a href='/newArticle.html'>文案添加</a></li>
      </ul>
    </header>
    <div class='flex-box'>
      <div class='nav-left no-grow animated' v-bind:class="{ 'slide-left': !showNav}">
        <div class="nav-leader" @click="showNav = !showNav">
          <p v-if="showNav"><i class="el-icon-d-arrow-left"></i> 收起</p>
          <p v-else><i class="el-icon-d-arrow-right"></i>  展开</p>
        </div>
        <el-menu class="el-menu-vertical-demo" @open="handleOpen" @select="handleSelect">
          <el-submenu index="hbpost">
              <template slot="title"><i class="el-icon-message"></i>三农业务风险分析系统</template>
              <el-menu-item v-bind:index="article._id" 
              v-for="article in articles.hbpost">
                {{article.contentTitle}}
              </el-menu-item>
            </el-submenu>
          </el-submenu>
          <el-submenu index="psbcias">
            <template slot="title"><i class="el-icon-menu"></i>三农行业信息分析系统</template>
            <el-menu-item v-bind:index="article._id" 
            v-for="article in articles.psbcias">
              {{article.contentTitle}}
            </el-menu-item>
          </el-submenu>
          <el-submenu index="predict">
            <template slot="title"><i class="el-icon-setting"></i>三农贷款还款预测系统</template>
            <el-menu-item v-bind:index="article._id" 
            v-for="article in articles.predict">
              {{article.contentTitle}}
            </el-menu-item>
          </el-submenu>
          <el-submenu index="operation">
            <template slot="title"><i class="el-icon-menu"></i>三农大数据决策系统</template>
            <el-menu-item v-bind:index="article._id" 
            v-for="article in articles.operation">
              {{article.contentTitle}}
            </el-menu-item>
          </el-submenu>
          <el-submenu index="reportmgr">
            <template slot="title"><i class="el-icon-setting"></i>报表抓取子系统</template>
            <el-menu-item v-bind:index="article._id" 
            v-for="article in articles.reportmgr">
              {{article.contentTitle}}
            </el-menu-item>
          </el-submenu>
          <el-submenu index="surveyrpt">
            <template slot="title"><i class="el-icon-menu"></i>调查报告优化录入系统</template>
            <el-menu-item v-bind:index="article._id" 
            v-for="article in articles.surveyrpt">
              {{article.contentTitle}}
            </el-menu-item>
          </el-submenu>
          <el-submenu index="cval">
            <template slot="title"><i class="el-icon-setting"></i>智能辅助控件</template>
            <el-menu-item v-bind:index="article._id" 
            v-for="article in articles.cval">
              {{article.contentTitle}}
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </div>
      <div class='content' v-bind:class="{ 'slide-right': showNav}">
        <h3 v-if="content._id">
          {{content.contentTitle}}
          <a v-bind:href="'/article.html#'+content._id" target="_blank">{{host + '/article.html#' + content._id}}</a>
          <div style="margin-top:5px;">
            <el-button type="info" icon="edit" @click="editArticle(content._id)">编辑</el-button>
            <el-button type="danger" icon="delete" @click="deleteArticle(content._id)">删除</el-button>
            <el-button type="primary" @click="wordExport">导出word</el-button>
          </div>
        </h3>
        <div class='tips-box' v-if="!content._id">
          <p>温馨提示：</p>
          <li>粘贴文字描述时，会自带格式。格式不易过复杂，可以先粘贴到记事本中去掉格式。</li>
          <li>添加图文时可以一次添加多个，后续可以优化为批量选择图片。</li> 
          <p>版本更新：</p>
          <li>布局可以选择图片在上或者文字在上。</li>
          <li>编辑时将文字描述全部删除，即可删除当前图文。</li> 
          <li>编辑－添加图文描述时，会添加到文档底部。</li> 
        </div>
        <div class='note-item flex-box animated' v-bind:class="note.animate" v-for="note in content.notes">
          <div class="note-item-pic" v-if="note.file">
            <img v-bind:src="'http://139.129.252.72:8000/webook/400/'+note.file" alt="">
          </div>
          <div class='note-item-text' v-html="note.text"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
var wordExport = require('wordExport')
var jQuery =  require('jQuery')
export default {
  data () {
    return {
      showNav: true,
      articles: {
        hbpost:  [],
        psbcias: [],
        predict: [],
        operation: [],
        reportmgr: [],
        surveyrpt: [],
        cval: []
      },
      content: {
        _id: '',
        contentTitle:'',
        notes:[]
      },
      host: 'http://' + window.location.host
    }
  },
  created: function () {
  },
  methods: {
    handleOpen(key, keyPath) {
      var me = this;
      fetch('/apis/article/'+key).then(function(response) {
        return response.json()
      }).then(function(json) {
        me.articles[key] = json;
        //console.log('parsed json', json)
      }).catch(function(ex) {
        me.$message.error('系统出错啦');
        console.log('parsing failed', ex)
      })
      //console.log(key, keyPath);
    },
    handleSelect(key, keyPath) {
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
      //console.log(key, keyPath);
    },
    editArticle: function(articleId) {
      window.location.href = '/newArticle.html#'+articleId;
    },
    deleteArticle: function(articleId) {
      this.$confirm('此操作将永久删除该文文案, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        var me = this;
        fetch('/apis/article/id/'+articleId,{
          method:'DELETE'
        }).then(function(response) {
          return response.json()
        }).then(function(json) {
          me.$message({
            showClose: true,
            message: '删除成功',
            type: 'success',
            duration: 1000,
            onClose: function() {
              window.location.href='/index.html';
            }
          });
          //console.log('parsed json', json)
        }).catch(function(ex) {
          me.$message.error('系统出错啦');
          console.log('parsing failed', ex)
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });          
      });
    },
    wordExport: function() {
      var title = this.content.contentTitle + new Date().getTime();
      jQuery(".content").wordExport(title);
    }
  }
}
</script>

