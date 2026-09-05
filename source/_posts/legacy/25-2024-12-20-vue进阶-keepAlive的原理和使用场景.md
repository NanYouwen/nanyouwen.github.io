---
title: "<keep-alive>的原理和使用场景"
date: "2024-12-20 19:04:52"
updated: "2024-12-30 09:21:52"
categories: ["vue进阶"]
tags: ["Java、python、go"]
permalink: "/vue进阶-keepAlive的原理和使用场景/"
---
<h1 id="原理"><a href="#原理" class="headerlink" title="原理"></a>原理</h1><p><keep-alive>是Vue的内置组件，用于对动态组件进行缓存，核心原理是通过缓存组件实例，避免不必要的销毁和重新创建,从而优化性能。</p>
<p><strong>1.关键机制:</strong></p>
<ul>
<li>缓存机制<ul>
<li>keep-alive对象内部维护了一个缓存对象（cache）,用于存储已经被渲染过的组件实例</li>
<li>当组件被换成时，其mounted钩子只会执行一次，而切换回来时只会触发activated钩子</li>
<li>被移除的组件不会销毁，而是保存在内存中</li>
</ul>
</li>
<li>匹配规则<ul>
<li>通过include和exclude属性控制需要缓存或者不需要缓存的组件</li>
<li>使用正则表达式、字符串或数组来匹配组件名</li>
</ul>
</li>
<li>生命周期钩子<ul>
<li>配合activated和deactivated钩子处理业务逻辑</li>
<li>activated：当组件从缓存中激活时触发</li>
<li>deactivated：当组件被缓存而不是销毁时触发</li>
</ul>
</li>
</ul>
<p>2.工作流程</p>
<ul>
<li>渲染时，keep-alive检查组件名是否需要缓存</li>
<li>如果需要：缓存实例，直接从缓存中读取，避免重复创建实例</li>
<li>如果不需要：销毁该组件，正常执行生命周期</li>
</ul>
<h1 id="使用场景"><a href="#使用场景" class="headerlink" title="使用场景"></a>使用场景</h1><p><strong>keep-alive通常用于需要频繁切换的组件场景，避免重复加载和渲染，从而提升性能</strong><br><strong>1.典型场景</strong></p>
<ul>
<li>多页签切换：例如后台管理系统中，多个tab页面之间的频繁切换，使用keep-alive可以避免每次切换时重新加载数据</li>
<li>表单场景：当填写表单后切换到其他组件再切回来时表单内容保持不变</li>
<li>性能优化：对数据量较大的组件，例如长列表或复杂图表组件进行缓存，减少渲染开销</li>
</ul>
<p><strong>2.注意事项</strong></p>
<ul>
<li>缓存大小：如果换成组件过多，可能导致内存占用过高</li>
<li>动态条件：include和exclude需要合理配置，避免缓存无用组件</li>
<li>生命周期管理:配合activated和deactivated管理组件状态，比如清理定时器、停止动画等</li>
</ul>
<h1 id="示例代码"><a href="#示例代码" class="headerlink" title="示例代码"></a>示例代码</h1><figure class="highlight plaintext"><table><tr><td class="gutter"><pre><span class="line">1</span><br><span class="line">2</span><br><span class="line">3</span><br><span class="line">4</span><br><span class="line">5</span><br><span class="line">6</span><br><span class="line">7</span><br><span class="line">8</span><br><span class="line">9</span><br><span class="line">10</span><br><span class="line">11</span><br><span class="line">12</span><br><span class="line">13</span><br><span class="line">14</span><br><span class="line">15</span><br><span class="line">16</span><br><span class="line">17</span><br><span class="line">18</span><br><span class="line">19</span><br><span class="line">20</span><br><span class="line">21</span><br><span class="line">22</span><br><span class="line">23</span><br><span class="line">24</span><br><span class="line">25</span><br><span class="line">26</span><br><span class="line">27</span><br><span class="line">28</span><br><span class="line">29</span><br><span class="line">30</span><br><span class="line">31</span><br><span class="line">32</span><br><span class="line">33</span><br><span class="line">34</span><br><span class="line">35</span><br><span class="line">36</span><br><span class="line">37</span><br><span class="line">38</span><br><span class="line">39</span><br><span class="line">40</span><br><span class="line">41</span><br><span class="line">42</span><br><span class="line">43</span><br><span class="line">44</span><br><span class="line">45</span><br><span class="line">46</span><br><span class="line">47</span><br><span class="line">48</span><br><span class="line">49</span><br><span class="line">50</span><br><span class="line">51</span><br><span class="line">52</span><br><span class="line">53</span><br><span class="line">54</span><br><span class="line">55</span><br><span class="line">56</span><br><span class="line">57</span><br><span class="line">58</span><br><span class="line">59</span><br><span class="line">60</span><br><span class="line">61</span><br><span class="line">62</span><br><span class="line">63</span><br><span class="line">64</span><br><span class="line">65</span><br><span class="line">66</span><br><span class="line">67</span><br><span class="line">68</span><br><span class="line">69</span><br><span class="line">70</span><br><span class="line">71</span><br><span class="line">72</span><br><span class="line">73</span><br><span class="line">74</span><br><span class="line">75</span><br><span class="line">76</span><br><span class="line">77</span><br><span class="line">78</span><br><span class="line">79</span><br><span class="line">80</span><br><span class="line">81</span><br><span class="line">82</span><br><span class="line">83</span><br><span class="line">84</span><br><span class="line">85</span><br><span class="line">86</span><br><span class="line">87</span><br><span class="line">88</span><br><span class="line">89</span><br><span class="line">90</span><br><span class="line">91</span><br><span class="line">92</span><br><span class="line">93</span><br><span class="line">94</span><br><span class="line">95</span><br><span class="line">96</span><br><span class="line">97</span><br><span class="line">98</span><br><span class="line">99</span><br><span class="line">100</span><br><span class="line">101</span><br><span class="line">102</span><br></pre></td><td class="code"><pre><code class="hljs vue">&lt;template&gt;<br>  &lt;div class=&#x27;HelloWorld&#x27;&gt;<br>    &lt;div class=&quot;nav-buttons&quot;&gt;<br>      &lt;button @click=&quot;currentView = &#x27;ViewA&#x27;&quot;&gt;视图A&lt;/button&gt;<br>      &lt;button @click=&quot;currentView = &#x27;ViewB&#x27;&quot;&gt;视图B&lt;/button&gt;<br>    &lt;/div&gt;<br><br>    &lt;keep-alive&gt;<br>      &lt;component :is=&quot;currentComponent&quot;&gt;&lt;/component&gt;<br>    &lt;/keep-alive&gt;<br>  &lt;/div&gt;<br>&lt;/template&gt;<br><br>&lt;script setup lang=&#x27;ts&#x27;&gt;<br>import &#123; ref, defineComponent, h, computed &#125; from &#x27;vue&#x27;<br><br>// 定义两个示例组件<br>const ViewA = defineComponent(&#123;<br>  name: &#x27;ViewA&#x27;,<br>  setup() &#123;<br>    const count = ref(0)<br>    return () =&gt; h(&#x27;div&#x27;, &#123; class: &#x27;view&#x27; &#125;, [<br>      h(&#x27;h2&#x27;, &#x27;View A&#x27;),<br>      h(&#x27;p&#x27;, `计数器: $&#123;count.value&#125;`),<br>      h(&#x27;button&#x27;, &#123; onClick: () =&gt; count.value++ &#125;, &#x27;增加&#x27;)<br>    ])<br>  &#125;<br>&#125;)<br><br>const ViewB = defineComponent(&#123;<br>  name: &#x27;ViewB&#x27;,<br>  setup() &#123;<br>    const message = ref(&#x27;&#x27;)<br>    return () =&gt; h(&#x27;div&#x27;, &#123; class: &#x27;view&#x27; &#125;, [<br>      h(&#x27;h2&#x27;, &#x27;View B&#x27;),<br>      h(&#x27;input&#x27;, &#123;<br>        value: message.value,<br>        onInput: (e: Event) =&gt; &#123;<br>          message.value = (e.target as HTMLInputElement).value<br>        &#125;<br>      &#125;),<br>      h(&#x27;p&#x27;, `输入的内容: $&#123;message.value&#125;`)<br>    ])<br>  &#125;<br>&#125;)<br><br>// 当前视图<br>const currentView = ref&lt;&#x27;ViewA&#x27; | &#x27;ViewB&#x27;&gt;(&#x27;ViewA&#x27;)<br><br>// 视图映射<br>const views = &#123;<br>  ViewA,<br>  ViewB<br>&#125;<br><br>const currentComponent = computed(() =&gt; &#123;<br>  return views[currentView.value]<br>&#125;)<br>&lt;/script&gt;<br><br>&lt;style scoped&gt;<br>.HelloWorld &#123;<br>  padding: 20px;<br>  max-width: 500px;<br>  margin: 0 auto;<br>&#125;<br><br>.nav-buttons &#123;<br>  margin-bottom: 20px;<br>  display: flex;<br>  gap: 10px;<br>  justify-content: center;<br>&#125;<br><br>button &#123;<br>  padding: 8px 16px;<br>  background-color: #4CAF50;<br>  color: white;<br>  border: none;<br>  border-radius: 4px;<br>  cursor: pointer;<br>&#125;<br><br>button:hover &#123;<br>  background-color: #45a049;<br>&#125;<br><br>.view &#123;<br>  padding: 20px;<br>  border: 1px solid #ddd;<br>  border-radius: 8px;<br>  margin-top: 20px;<br>&#125;<br><br>input &#123;<br>  padding: 8px;<br>  margin: 10px 0;<br>  width: 100%;<br>  border: 1px solid #ddd;<br>  border-radius: 4px;<br>&#125;<br>&lt;/style&gt;<br></code></pre></td></tr></table></figure>

                
              </div>
            
            <hr/>
            <div>
              <div class="post-metas my-3">
  
    <div class="post-meta mr-3 d-flex align-items-center">
      <i class="iconfont icon-category"></i>
      

<span class="category-chains">
  
  
    
      <span class="category-chain">
        
  <a href="/categories/vue%E8%BF%9B%E9%98%B6/" class="category-chain-item">vue进阶</a>
  
  

      </span>
    
  
</span>

    </div>
  
  
</div>


              
  

  <div class="license-box my-3">
    <div class="license-title">
      <div>&lt;keep-alive&gt;的原理和使用场景</div>
      <div>https://nanyouwen.github.io/vue进阶-keepAlive的原理和使用场景/</div>
    </div>
    <div class="license-meta">
      
        <div class="license-meta-item">
          <div>作者</div>
          <div>南有文</div>
        </div>
      
      
        <div class="license-meta-item license-meta-date">
          <div>发布于</div>
          <div>2024年12月20日</div>
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
                    
                    
                      <a href="/js-dayjs%E5%BA%93/" title="dayjs库的使用">
                        <i class="iconfont icon-arrowleft"></i>
                        <span class="hidden-mobile">dayjs库的使用</span>
                        <span class="visible-mobile">上一篇</span>
                      </a>
                    
                  </article>
                  <article class="post-next col-6">
                    
                    
                      <a href="/web-js%E4%B8%8EjQuery/" title="js与jQuery">
                        <span class="hidden-mobile">js与jQuery</span>
                        <span class="visible-mobile">下一篇</span>
                        <i class="iconfont icon-arrowright"></i>
                      </a>
                    
                  </article>
                </div>
