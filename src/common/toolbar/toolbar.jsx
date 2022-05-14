import React from 'react';
import { classnames } from '../../helpers';
import logo from '../../../static/images/logo.svg';
import { Button } from "../button";
import { Link } from "gatsby";
import { bool } from "prop-types";
import styles from './toolbar.module.css';

const Toolbar = ({withGetStartedButton}) => {

    const menuItems = (
        <div className={styles.modal}>
            <div className={styles.modalHeader}>
            </div>
            <div className={styles.modalBody}>
                <>
                    <div>
                        <span className={styles.text}>Work</span>
                    </div>
                    <div>
                        <span className={styles.text}>Services</span>
                    </div>

                    <div>
                        <span className={styles.text}>Our Company</span>
                    </div>

                    <div>
                        <span className={styles.text}>Community</span>
                    </div>
                </>
            </div>
        </div>
    );

    const handleStartNow = () => {
        window.scrollTo(0, 2000);
    };

    return (
        <>
            <nav className={styles.toolbar}>
                <Link to="/home">
                    <img src={logo} alt="" className={styles.logo}/>
                </Link>
                <div className={styles.right}>
                    <div
                        className={classnames({
                            [styles.buttonsContainer]: withGetStartedButton,
                        })}
                    >
                        {withGetStartedButton && (
                            <Button
                                className={styles.button}
                                onClick={handleStartNow}
                            >
                                Get Started Now
                            </Button>
                        )}
                    </div>
                </div>
            </nav>

            <div>
                {menuItems}
            </div>
        </>
    );
};

Toolbar.propTypes = {
    withGetStartedButton: bool,
};
Toolbar.defaultProps = {
    withGetStartedButton: false,
};

export {Toolbar};
