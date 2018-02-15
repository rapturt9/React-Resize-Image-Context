/* 

	Calculates low-energy seams across a 2d array of gradient magnitude data

*/


class Seams {
	constructor(gradient) {
		this.gradientMatrix = gradient.magnitude;
		this.width = gradient.width;
		this.height = gradient.height;

		this.minSeamMatrix = null;
		this.minSeam = null;

		this.generateMinSeamMatrix();
		this.pluckMinSeam();
	}


	generateMinSeamMatrix = () => {
		// create a new minSeamMatrix and calculate seams
		this.minSeamMatrix = [];
		this.fillMinSeamMatrix();
	}


	/*
	Fills a two-dimensional array representing pixels by [x][y]
	with the minimum energy cost required to reach that pixel
	using a dynamic programming approach
	*/
	fillMinSeamMatrix = (y = 0) => {
		if (y === 0) {
			for (let x = 0; x < this.width; x++) {
				this.minSeamMatrix[x] = [ [ this.gradientMatrix[x][y] ] ];
			}
		} else {
			for (let x = 0; x < this.width; x++) {
				let min = Infinity;

				let p1 = (x > 0) ? this.minSeamMatrix[x - 1][y - 1] : Infinity;
				let p2 = this.minSeamMatrix[x][y - 1];
				let p3 = (x < this.width - 1) ? this.minSeamMatrix[x + 1][y - 1] : Infinity;

				this.minSeamMatrix[x][y] = Math.min(p1, p2, p3) + this.gradientMatrix[x][y];
			}
		}

		if (y < this.height - 1) this.fillMinSeamMatrix(y + 1);
	}


	/*
	Works backwards through our minSeamMatrix to pick out
	a set of [x] => y coordinate mappings which correspond
	with the seam through the image with the lowest total energy
	*/
	pluckMinSeam = () => {
		let min = Infinity;
		let x = 0;
		let y = this.height - 1;

		// get our starting x
		this.minSeamMatrix.forEach((col, i) => {
			if (min > col[this.height - 1]) {
				min = col[this.height - 1];
				x = i;
			}
		})

		// start our seam from here and work backwards across the matrix
		// to find the path that generated this value stored as an array of
		// [x, y] values
		let seam = [[x, y]];

		for (; y > 0; y--) {
			// grab the [x,y] coords for the minimum in the previous row's neighborhood
			let min = Infinity;
			let xDiff;
			
			// handles left- and right-edge pixels
			let n = (x > 0) ? -1 : 0;
			let m = (x < this.width - 1) ? 1 : 0;

			for (let i = n; i <= m; i++) {
				if (min > this.minSeamMatrix[x + i][y]) {
					min = this.minSeamMatrix[x + i][y];
					xDiff = i;
				}
			}

			x += xDiff;
			seam.push([x, y - 1]);
		}

		this.minSeam = seam;
	}
}


export default Seams;