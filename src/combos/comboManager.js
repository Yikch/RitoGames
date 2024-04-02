
const MAX_LENGTH = 5;
const TIME = 200;
export default class comboManager{
	constructor(combos){
		this.history = [];
		this.combos = combos;
	}


	addMovementInput(dir, time){
		if (this.history.length > 0 && this.history[this.history.length - 1][1] == dir) return;
		if (dir === undefined) return;
		this.history.push([time, dir]);
		if(this.history.length > MAX_LENGTH){
			this.history.shift();
		}
		console.log(this.history);
	}

	checkSpecialMove(id, time){
		this.history.push([time, id]);
		for (let i = 0; i < this.combos.length; i++){
			if (this.checkCombo(this.history, this.combos[i].keys)){
				return this.combos[i].id;
			}
		}
		return undefined;
	}

	checkCombo(history, keys){
		let pointer = 0;
		if (history.length < keys.length) return false;
		while (pointer < keys.length){
			if (history[history.length - pointer - 1][1] != keys[keys.length - pointer - 1]){
				return false;
			}
			pointer++;
		}
		return history[history.length - keys.length][0] - history[history.length - 1][0] <= TIME;
		
	}
}