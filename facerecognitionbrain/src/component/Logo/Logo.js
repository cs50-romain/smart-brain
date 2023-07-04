import React from 'react';
import Tilt from 'react-parallax-tilt';

const Logo = () => {
	return(
		<div className='absolute top-0 left-o pa3'>
			<Tilt>
      			<div className="br2 shadow-2" style={{ backgroundColor: 'transparent' }}>
        			<img style={{paddingTop: '5px', width: '150px'}} src="https://api.dicebear.com/6.x/big-smile/svg?seed=Romain" alt="avatar"/>
      			</div>
    		</Tilt>
		</div>
	)
}

export default Logo;