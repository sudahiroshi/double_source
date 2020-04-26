// Double Sourceの計算と描画
import "js/web.jsx";
import "vcanvas.jsx";
import "nylon.client.jsx";
import "vbTimer.jsx";

final class test {
	var value1 = 4;
	var value2 = 6;
	var elm = Array.<HTMLCanvasElement>;
	var vc = Array.<VCanvas>;
	var cnt = 0;
	var timer1: vbTimer;

	static function main( canvasId:string ) : void {
		var vc = []: Array.<VCanvas>;
		var elm = []: Array.<HTMLCanvasElement>;
		for( var i=0; i<7; i++ ) {
			elm.push( dom.id( canvasId + i as string ) as HTMLCanvasElement );
			vc.push( new VCanvas( elm[i] ) );
		}
		var hoge = new test(elm, vc);
		hoge.init();
	}

	function constructor ( elm: Array.<HTMLCanvasElement>, vc: Array.<VCanvas> ) {
		this.elm = elm;
		this.vc = vc;

		this.timer1 = new vbTimer();
		this.timer1.interval = 100;
		this.timer1.timer = (): void -> {
			for (var i = 0; i < 7; i++){
				this.elm[i].style.visibility = "hidden";
			}
			this.cnt = ( this.cnt + 1 ) % 7;
			this.elm[this.cnt].style.visibility = "visible";
		};
		
		var nl = new nylon();
		nl.on( "start", ( dummy: Map.<variant> ): void -> {
			this.value1 = dummy['range1'] as number;
			this.value2 = dummy['range2'] as number;
			this.init();
		});
		nl.on( "stop", ( dummy: Map.<variant> ): void -> {
			this.timer1.disable();
		});
		nl.on( "c1", ( dummy: Map.<variant> ): void -> {
			this.value1 = dummy['range'] as number;
		});
		nl.on( "c2", ( dummy: Map.<variant> ): void -> {
			this.value2 = dummy['range'] as number;
		});
	}
	function init(): void {
		this.timer1.disable();
		this.animation(this.value1, this.value2);
		this.timer1.enable();
	}
	function animation( value1:number, value2:number ) : void {
		var PY2 = Math.PI * 2;
		var PY = Math.PI;
		for( var i=0; i<7; i++ ) {
			this.vc[i].scale(-3, -8, 12, 12);

			var d = value1 / 20; //初期値value1=4
			var fy = PY2 / 7 * i;
			var th = value2 * 10 / 180 * PY; //初期値value2=6
			var ra:number, rb:number, waveA:number, waveB:number, cw:number;
			this.vc[i].beginPath();

			for( var k = -3; k <= 9; k += 0.08) {
				for( var j = -8; j <= 4; j += 0.08 ) {
					ra = Math.sqrt(k * k + (j - d) * (j - d));
					rb = Math.sqrt(k * k + (j + d) * (j + d));
					waveA = Math.sin(PY2 / th * ra - fy) / (1 + ra / 10);
					waveB = Math.sin(-PY2 / th * rb + fy) / (1 + rb / 10);
					cw = 127 + 126 * (waveA + waveB) / 2;
					cw = Math.floor( cw );
					this.vc[i].forecolor( 0, cw, cw, 1 );
					this.vc[i].rect( k, j, k+1, j+1 );
				}
			}
			this.vc[i].fill();
			//ガイド表示
			this.vc[i].forecolor( 255, 255, 255, 1 );
			this.vc[i].line (0, -3, 0, 2);
			this.vc[i].forecolor( 255, 255, 255, 1 );
			this.vc[i].line (-2, 0, 2, 0);
			this.vc[i].forecolor( 255, 255, 255, 1 );
			this.vc[i].line (-3.2, -d, 0, -d);
			this.vc[i].forecolor( 255, 255, 255, 1 );
			this.vc[i].line (-3.2, d, 0, d);
			this.vc[i].stroke();

			var nn = Math.sin(PY2 / 7 * i);
			//上丸
			this.vc[i].beginPath();
			this.vc[i].forecolor(254, 74, 0, 1);
			this.vc[i].circle( 0, -d, (0.4+0.05*nn)/1*15 );
			this.vc[i].fill();
	        //下丸
	        this.vc[i].beginPath();
	        this.vc[i].forecolor(244, 0, 244, 1);
	        this.vc[i].circle( 0, d, (0.4-0.05*nn)/1*15 );		    
	        this.vc[i].fill();
	    }
	}
}

class gui {
	static function main( btn1:string, btn2:string, range1:string, range2:string ): void {
		var nl2 = new nylon();
		var b1 = dom.id(btn1) as HTMLButtonElement;
		var c1 = dom.window.document.getElementById(range1) as HTMLInputElement;
		var c2 = dom.window.document.getElementById(range2) as HTMLInputElement;
		b1.addEventListener( "click", function( e: Event ): void {
			var msg = {
				"range1": c1.value as number,
				"range2": c2.value as number
			}:Map.<variant>;
			nl2.emit( "start", msg );
		});
		var b2 = dom.id(btn2) as HTMLButtonElement;
		b2.addEventListener( "click", function( e: Event ): void {
			nl2.emit( "stop", null );
		});
		c1.addEventListener("change",  function( e: Event ): void{
			var msg = {
				"range": c1.value as number
			}:Map.<variant>;
			nl2.emit( "c1", msg );
		});
		c2.addEventListener("change",  function( e: Event ): void{
			var msg = {
				"range": c2.value as number
			}:Map.<variant>;
			nl2.emit( "c2", msg );
		});
	}
}
