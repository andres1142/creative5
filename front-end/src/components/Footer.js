import React from 'react';
import gitLogo from './images/GitHub-Mark.png'

function Footer() {
    return (
        <footer>
            <a href={'https://github.com/andres1142/creative4.git'}>
                <img src={gitLogo} width={'100px'} alt="Logo" />
            </a>
        </footer>
    )
}
export default Footer;