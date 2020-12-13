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
	const userIdx = location.href.lastIndexOf('=')+1;
	const userName = decodeURI(location.href.substr(userIdx));
	if (userIdx && userName) {
		console.log(userIdx, userName);
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
		console.log(imgURLs[i]);
		image.onload = function(){
			workContext.drawImage(image, 1, 1);
			imagesOk++;
			if (imagesOk >= imgURLs.length)
				callback(workCanvas);
		}
	}
}

function drawCanvas(workCanvas){
	const context = canvas.getContext('2d');
	context.drawImage(workCanvas, 0, 0);
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
   	   };
	}
);
