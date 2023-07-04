import React from 'react';
import './facerecognition.css';

const FaceRecognition = ({ imageURL, box }) => {
	return (
		<div className='center ma2'>
			<div className='absolute mt2'>
				<img id='inputimage' width='500px' height='auto' src={imageURL} alt='image'/>
				<div className='bounding_box' style={{top: box.topRow, bottom: box.bottomRow, right: box.rightCol, left: box.leftCol}}></div>
			</div>
		</div>
	)
}

export default FaceRecognition;