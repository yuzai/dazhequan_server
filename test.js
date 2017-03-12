// var s='';

// if(s){
// 	console.log('hello');
// }else
// {
// 	console.log('no');
// }
// function a(){return 1};
// function b(){return 3};
// function test(a,b){
// 	console.log(arguments);
// 	console.log(a()+b());
// }
// test(function(){return 1},function(){return 2});

function test(){
	var s = document.body;
	var q = 1;
	console.log(s);
	s.addEventListener('click',function(){
		console.log(q)
		console.log(s)
	});
	setTimeout(function(){
		console.log(q)
		console.log(s)
	},1000);
}
test();

var name = 'xiaobno';
var test2 = {
	name:'xiaobo',
	sayname:function(){
		var name = 'nihao';
		setTimeout(function()
			{
				console.log(name)
			},1000);
	}
}
test2.sayname();
