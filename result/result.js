const canvas = document.getElementById("jsCanvas");
const userImg = document.querySelector(".character");
const save = document.querySelector(".jsSave");

const url = "http://seohee-choi@github.io/LifeOn42";

canvas.width = 500;
canvas.height = 500;

function share(title, url) {
	if(navigator.share){
		navigator.share({title: title, text: "당신의 42 성향을 알아보세요!!", url: url});
	} else {
		alert('지원하지 않는 브라우저입니다.');
	}
}

function saveImg() {
	const pic = canvas.toDataURL();
	const a = document.createElement("a");
	a.href = pic;
	a.download = "myLifeOn42";
	a.click();
}

function paintUserName(userName){	
	const title = document.querySelector(".js-title");
	title.innerText = `${userName}님의 LifeOn42는...`;
}

function getUserName(){
  //name을 location말고 localstorage에 넣으세요 ^^

	// const userIdx = location.href.lastIndexOf('=')+1;
	const userName = localStorage.getItem("userName");
	// decodeURI(location.href.substr(userIdx));
	if (userName) {
		// console.log(userIdx, userName);
		paintUserName(userName);
	}
}

function getUserVal(){
	const userVal = localStorage.getItem("valList");
	return userVal;
}

function getImageURL(){
	const userVal = JSON.parse(getUserVal());
	const imageURLs = [];
	imageURLs.push(`../pic/default2.png`);

	let i = 0;
	userVal.forEach(function(element) { 
		imageURLs.push(`../pic/${i}/${element}.png`);
		i++;
	});
	return imageURLs;
}

function handleImage(callback){
	const imgURLs = getImageURL();
	//이미지 요소들을 일시에 뿌려주기 위해서 두 개의 캔버스 사용했습니다.
	const workCanvas = document.createElement("canvas");
	const workContext = workCanvas.getContext('2d');
	workCanvas.width = 500;
	workCanvas.height = 500;

	let imagesOk = 0;
	for (let i=0; i<imgURLs.length; i++) { 
		let image = new Image(); 
		image.src = imgURLs[i];
		image.onload = function(){
			//요소의 로딩시간이 길어지면 다른 요소가 로딩되지 않는 현상이 발생했습니다.
			//해당 문제를 해결하기 위해 콜백, 클래스, 온로드 등 여러가지 시도를 해보았으나 실패했습니다.
			workContext.drawImage(image, 1, 1);
			imagesOk++;
			if (imagesOk >= imgURLs.length)
			{
				callback(workCanvas);
			}
		}
	}
}

function drawCanvas(workCanvas){
	const context = canvas.getContext('2d');
	context.drawImage(workCanvas, 0, 0);
	console.log(imagesOk, imgURLs.length);
}

function init(){
	getUserName();
	handleImage(drawCanvas);
	if (save) {
		save.addEventListener("click", saveImg);
	}
}

document.addEventListener("DOMContentLoaded", () =>{
    window.onload = () => {
			init();
			if (location.href.indexOf('#')==-1) 
				location.replace(location.href+'?#');
   	   };
	}
);