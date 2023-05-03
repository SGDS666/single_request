# single_request

在介绍这个包之前，我想简要解释一下开发这个包的动机和应用场景

让我们首先来看一下传统的React请求数据场景

<img width="414" alt="image" src="https://user-images.githubusercontent.com/86196091/235846768-7f4fef72-ac0d-4c56-9a51-7e0447e21b1f.png">

这是一个纯显示列表，通过Axios请求数据渲染时一切正常
当我们在多个地方需要他时，就像这样

<img width="237" alt="image" src="https://user-images.githubusercontent.com/86196091/235847154-53737c7b-62ed-4882-a406-ba2fea267471.png">

出现重复的网络请求

<img width="1839" alt="image" src="https://user-images.githubusercontent.com/86196091/235847510-b4f8ba3b-0337-4615-880e-f4e0573bb50d.png">

因此，我们的第一个要求是共享来自同一请求的数据

但我们现在不要急于解决这个问题，继续看更多的场景

<img width="637" alt="image" src="https://user-images.githubusercontent.com/86196091/235849145-532edd97-f9f5-4412-bac0-ee8cdab74dd2.png">
<img width="633" alt="image" src="https://user-images.githubusercontent.com/86196091/235849171-e62581ef-ccae-4f30-a1fe-c7aca218e55a.png">

让我们添加一些内容
为每个子项目添加年龄增长功能
并添加一个函数来保存和修改此列表组件
所以我们现在有了这个要求
随着年龄的增长，数据是相同的。我们希望每个列表项的数据都是同步的
但这些数据存储在本地状态，我们不想频繁地启动网络请求来更改数据。
相反，本地记录在保存时会存储在服务器上

让我们先看看目前的实际情况

<img width="561" alt="image" src="https://user-images.githubusercontent.com/86196091/235849961-4e7d59ac-7e9f-4d53-be12-732b7709d106.png">

不幸的是，组件的状态是独立的，因此本地没有同步
为了解决这个问题，我们可能需要执行状态提升或使用useContext
但我们不想这样做,会比较麻烦



<code>useSingleRequest</code>

让我们试着使用全新的方案
<img width="583" alt="image" src="https://user-images.githubusercontent.com/86196091/235863293-c9fd4a47-1bf6-48df-8f04-bd0f61ccb338.png">


网络请求，只剩下一个
<img width="1731" alt="image" src="https://user-images.githubusercontent.com/86196091/235863439-101262a2-4ab5-48b0-8eae-f2c7193452c3.png">


本地状态的同步变化
![Kapture 2023-05-03 at 16 13 44](https://user-images.githubusercontent.com/86196091/235863944-561ee670-4a8a-4fad-a35c-60ad8c0ce0c8.gif)


用新请求结果覆盖本地状态
<img width="499" alt="image" src="https://user-images.githubusercontent.com/86196091/235864670-cf3a1944-3cf4-480d-a4b3-33f41f9f22ed.png">

![Kapture 2023-05-03 at 16 18 49](https://user-images.githubusercontent.com/86196091/235865044-b2e0b5df-530b-4e8e-966c-aef5a8d41be7.gif)


通过这些演示，我相信你会有一些疑虑，比如状态管理是如何进行的。
我将其与Facebook的实验性状态管理库Recoil相结合，
所以如果你想使用它，你需要导入 封装了RecoilRoot的根组件 放在根节点

<img width="371" alt="image" src="https://user-images.githubusercontent.com/86196091/235866173-074e429e-540f-4cc9-a695-1e7b67c2e42b.png">

如果你已经在使用Recoil，你所需要做的就是像这样导入SRProvider
<img width="366" alt="image" src="https://user-images.githubusercontent.com/86196091/235866647-b2261cf4-930c-4309-81d1-6b604edf7358.png">

现在让我们正式了解一下具体的使用方法
<img width="566" alt="image" src="https://user-images.githubusercontent.com/86196091/235867286-e0337e24-6b4c-436a-bd77-2167fea4b88f.png">

useSingleRequest接收三个参数
第一个参数是当前为存储同一请求的数据唯一key
第二个参数是你的请求函数将会被主动调用
第三个参数是你提供的格式化程序，它将在成功获得结果后格式化请求最终得到的结果就是解构出的data

SetData用于更改本地状态，就像setState一样
有几个与状态相关的布尔值isLoading isError
当出现请求错误时，将自动捕获该错误
如果你想知道具体信息，你可以解构errorMessage 查看具体错误
runRequest是您传入的请求函数被封装了各种内部状态关联的产物。调用后的请求结果将更新data
所以你注意到有两种方法可以更新数据
一种是在本地更新setData
一个是runRequest请求新的数据更新



