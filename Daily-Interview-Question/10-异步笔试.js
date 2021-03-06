
/**
 * JS中的同步异步编程
 * 1、浏览器只分配一个线程，用来执行JS代码(一次只能做一个事情 => 同步)
 * 2、任务队列的机制： 遇到需要异步执行的任务（客户端： 定时器、事件绑定、AJAX、Promise、await），先把任务放置在任务队列中，接下来继续执行同步任务，
 * 当同步任务都执行完了，浏览器渲染线程闲下来了，再去任务队列中，按照指定顺序把异步任务拿出来执行......
 *  => Event Loop
 *  => Event Queue:  微任务 宏任务  （先找微任务，再找宏任务）
 */
new Promise((resolve, reject) => {
    // 立即把这个函数执行
    resolve(); // 异步=> 方法执行，不是立即通知then中存放的方法执行，而是一个异步的，等一些事情处理完，再把promise状态改变，并且通知指定的方法执行
  }).then(result=>{}, reason=>{})
  
  // async 把当前函数返回promise实例
  async function func() {
    // 遇到await 先把func2执行，看他的返回结果，await必须保证返回的是成功态，才会把下面代码执行
    // 异步体现在await下面的代码先不执行，等func2返回成功才会执行 
    await func2();
    console.log('ok')
    // 默认返回promise实例
  }
  
  // ========
  /** promise和await 是微任务
   * 任务队列
   *  微任务：1、await(下面代码) 2、Resolve(通知then中的第一个方法执行)
   *  宏任务：1.定时器(5ms 执行代码)
   */
  async function async1() {
    console.log('async1 start'); // => 2
    await async2();
    console.log('async1 end'); // => 6
  }
  async function async2() {
    console.log('async2'); // => 3
  }
  console.log('script start'); // => 1
  setTimeout(function () {
    console.log('setTimeout'); // => 9
  }, 0)
  async1();
  new Promise(function (resolve) {
    console.log('promise1'); //=> 4
    resolve();
  }).then(function () {
    console.log('promise2'); // => 7
  }).then(res=> {
    console.log('promise3'); // 8
  });
  console.log('script end'); // => 5
  // ----浏览器渲染线程空闲下来了  去任务队列中找微任务
  // 正常微任务的执行顺序，谁先放置的谁先执行 (不同V8 的版本对于它的处理会有所偏差)
  // 微任务1
  // 微任务2
  // 宏任务1