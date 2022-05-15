declare module '*.png';
declare module '*.svg';
declare interface NodeModule{
	hot:{
		accept(path:string,callback:()=>void):void,
	}
}

