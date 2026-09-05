---
title: "Docker安装教程-Linux"
date: "2023-05-01 19:04:52"
updated: "2024-12-24 16:27:57"
categories: ["其他"]
tags: ["Java、python、go"]
permalink: "/其他-Docker安装教程-Linux/"
---
<p>确保自己的yum是最新：sudo yum update</p>
<p><strong>1.卸载旧版本</strong>：如果你从未安装过则不用执行</p>
<figure class="highlight shell"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br></pre></td><td class="code"><pre><code class="hljs shell">sudo yum remove docker \<br>                 docker-client \<br>                 docker-client-latest \<br>                 docker-common \<br>                 docker-latest \<br>                 docker-latest-logrotate \<br>                 docker-logrotate \<br>                 docker-engine<br></code></pre></td></tr></table></figure>

<p><strong>2.配置Docker的yum库</strong></p>
<p>首先安装yum工具</p>
<figure class="highlight shell"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br></pre></td><td class="code"><pre><code class="hljs shell">yum install -y yum-utils \<br>           device-mapper-persistent-data \<br>           lvm2 --skip-broken<br></code></pre></td></tr></table></figure>

<p>安装成功后执行命令配置Docker的yum源</p>
<figure class="highlight shell"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br></pre></td><td class="code"><pre><code class="hljs shell">yum-config-manager \<br>    --add-repo \<br>    https://download.docker.com/linux/centos/docker-ce.repo<br></code></pre></td></tr></table></figure>

<p><strong>3.安装Docker</strong></p>
<p>执行命令安装docker</p>
<figure class="highlight bash"><table><tr><td class="gutter"><pre><span class="line">1</span><br></pre></td><td class="code"><pre><code class="hljs bash">yum install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin<br></code></pre></td></tr></table></figure>

<p><strong>4.启动和校验docker</strong></p>
<figure class="highlight bash"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br></pre></td><td class="code"><pre><code class="hljs bash"><span class="hljs-comment"># 启动</span><br><span class="hljs-built_in">sudo</span> systemctl start docker<br><span class="hljs-comment"># 停止</span><br><span class="hljs-built_in">sudo</span> systemctl stop docker<br><span class="hljs-comment">#重启</span><br><span class="hljs-built_in">sudo</span> systemctl restart docker<br><span class="hljs-comment">#设置开机自启动</span><br><span class="hljs-built_in">sudo</span> systemctl <span class="hljs-built_in">enable</span> docker<br><span class="hljs-comment">#执行docker ps命令，不报错则说明安装启动成功</span><br>docker ps<br></code></pre></td></tr></table></figure>

<p><strong>5.配置镜像加速器</strong>：以阿里云为例</p>
<ol>
<li>访问官网<a target="_blank" rel="noopener" href="https://www.aliyun.com/">https://www.aliyun.com/</a>  注册账户</li>
<li>找到容器镜像服务<img src="/../img/Docker%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B-Linux/image-20240801195441887.png" srcset="/img/loading.gif" lazyload alt="image-20240801195441887"></li>
<li>点击管理控制台<img src="/../img/Docker%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B-Linux/image-20240801195614707.png" srcset="/img/loading.gif" lazyload alt="image-20240801195614707"></li>
<li>选择镜像工具找到镜像加速器<img src="/../img/Docker%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B-Linux/image-20240801195746401.png" srcset="/img/loading.gif" lazyload alt="image-20240801195746401"></li>
<li>参考文档命令配置<img src="/../img/Docker%E5%AE%89%E8%A3%85%E6%95%99%E7%A8%8B-Linux/image-20240801195946566.png" srcset="/img/loading.gif" lazyload alt="image-20240801195946566"></li>
</ol>

                
              </div>
            
            <hr/>
            <div>
              <div class="post-metas my-3">
  
    <div class="post-meta mr-3 d-flex align-items-center">
      <i class="iconfont icon-category"></i>
      

<span class="category-chains">
  
  
    
      <span class="category-chain">
        
  <a href="/categories/%E5%85%B6%E4%BB%96/" class="category-chain-item">其他</a>
  
  

      </span>
    
  
</span>

    </div>
  
  
</div>


              
  

  <div class="license-box my-3">
    <div class="license-title">
      <div>Docker安装教程-Linux</div>
      <div>https://nanyouwen.github.io/其他-Docker安装教程-Linux/</div>
    </div>
    <div class="license-meta">
      
        <div class="license-meta-item">
          <div>作者</div>
          <div>南有文</div>
        </div>
      
      
        <div class="license-meta-item license-meta-date">
          <div>发布于</div>
          <div>2023年5月1日</div>
        </div>
      
      
      
        <div class="license-meta-item">
          <div>许可协议</div>
          <div>
            
              
              
                <a class="print-no-link" target="_blank" href="https://creativecommons.org/licenses/by/4.0/">
                  <span class="hint--top hint--rounded" aria-label="BY - 署名">
                    <i class="iconfont icon-cc-by"></i>
                  </span>
                </a>
              
            
          </div>
        </div>
      
    </div>
    <div class="license-icon iconfont"></div>
  </div>



              
                <div class="post-prevnext my-3">
                  <article class="post-prev col-6">
                    
                    
                      <a href="/vue%E5%9F%BA%E7%A1%80-vue3%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F/" title="vue3生命周期">
                        <i class="iconfont icon-arrowleft"></i>
                        <span class="hidden-mobile">vue3生命周期</span>
                        <span class="visible-mobile">上一篇</span>
                      </a>
                    
                  </article>
                  <article class="post-next col-6">
                    
                    
                      <a href="/java%E5%9F%BA%E7%A1%80-GC%E5%9E%83%E5%9C%BE%E5%9B%9E%E6%94%B6/" title="GC垃圾回收">
                        <span class="hidden-mobile">GC垃圾回收</span>
                        <span class="visible-mobile">下一篇</span>
                        <i class="iconfont icon-arrowright"></i>
                      </a>
                    
                  </article>
                </div>
