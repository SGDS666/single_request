# single_request

Before introducing this package, I would like to briefly explain my motivation and application scenarios for developing this package

Let's first take a look at the traditional React request data scenario

<img width="414" alt="image" src="https://user-images.githubusercontent.com/86196091/235846768-7f4fef72-ac0d-4c56-9a51-7e0447e21b1f.png">

This is a pure display list, and everything is normal when requesting data rendering through Axios
When we need him in multiple places, like this

<img width="237" alt="image" src="https://user-images.githubusercontent.com/86196091/235847154-53737c7b-62ed-4882-a406-ba2fea267471.png">

A duplicate network request has occurred

<img width="1839" alt="image" src="https://user-images.githubusercontent.com/86196091/235847510-b4f8ba3b-0337-4615-880e-f4e0573bb50d.png">

So our first requirement arises to share data from the same request

But let's not rush to solve it for now and continue watching more scenes

<img width="637" alt="image" src="https://user-images.githubusercontent.com/86196091/235849145-532edd97-f9f5-4412-bac0-ee8cdab74dd2.png">
<img width="633" alt="image" src="https://user-images.githubusercontent.com/86196091/235849171-e62581ef-ccae-4f30-a1fe-c7aca218e55a.png">

Let's add some content
Add an age increasing feature to each sub project
And add a function to save and modify this list component
So we now have this requirement
When increasing age, the data is the same. We hope that the data for each list item is synchronized
But this data is stored in a local state, and we do not want to frequently initiate network requests to change the data. 
Instead, local records are stored on the server when saved

Let's take a look at the current actual situation first

<img width="561" alt="image" src="https://user-images.githubusercontent.com/86196091/235849961-4e7d59ac-7e9f-4d53-be12-732b7709d106.png">

Unfortunately, the status of the components is separate, so there is no synchronization locally

To solve this problem, we may need to perform state improvement or use useContext

But we didn't want to do this, so I tried writing a hook to solve this problem



<code>useSingleRequest</code>

Let's try using the brand new hooks
<img width="583" alt="image" src="https://user-images.githubusercontent.com/86196091/235863293-c9fd4a47-1bf6-48df-8f04-bd0f61ccb338.png">


The network request is intuitive, only one remains
<img width="1731" alt="image" src="https://user-images.githubusercontent.com/86196091/235863439-101262a2-4ab5-48b0-8eae-f2c7193452c3.png">


Synchronous change of local state
![Kapture 2023-05-03 at 16 13 44](https://user-images.githubusercontent.com/86196091/235863944-561ee670-4a8a-4fad-a35c-60ad8c0ce0c8.gif)


Overwrite local state with new request
<img width="499" alt="image" src="https://user-images.githubusercontent.com/86196091/235864670-cf3a1944-3cf4-480d-a4b3-33f41f9f22ed.png">

![Kapture 2023-05-03 at 16 18 49](https://user-images.githubusercontent.com/86196091/235865044-b2e0b5df-530b-4e8e-966c-aef5a8d41be7.gif)


Through these demonstrations, I believe you will have some doubts, such as how state management is carried out.
I have combined this with Facebook's experimental state management library, 
Recoil, so if you want to use it, you need to import and encapsulate the components of RecoilRoot and root nodes like this

<img width="371" alt="image" src="https://user-images.githubusercontent.com/86196091/235866173-074e429e-540f-4cc9-a695-1e7b67c2e42b.png">

If you are already using Recoil, all you need to do is import the SRProvider like this
<img width="366" alt="image" src="https://user-images.githubusercontent.com/86196091/235866647-b2261cf4-930c-4309-81d1-6b604edf7358.png">

Now let's officially learn about the specific usage methods
<img width="566" alt="image" src="https://user-images.githubusercontent.com/86196091/235867286-e0337e24-6b4c-436a-bd77-2167fea4b88f.png">

UseSingleRequest receives three parameters
The first parameter is the unique key currently requested to store data for the same key
The second parameter is that your request function will be actively called
The third parameter is the formatting program you provided, which will format the request after successfully obtaining the result
And the final result obtained is data
SetData is used to change the local state, just like setState
There are several state related Boolean values isLoading isError
When a request error occurs, the error will be automatically captured
If you want to know specific information, you can receive another errorMessage
RunRequest is the request function that you pass in to encapsulate various internal states. When called, the result will be assigned to the data
So you noticed that there are two ways to update data
One is to update setData locally
One is runRequest requesting new data updates

There is also an optional fourth parameter

{
  log?: boolean,
  refreshInterval?: number  (ms)
}

