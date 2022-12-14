import React from 'react';
import './Modal.css';

const Modal = (props) => {
    const { open, close, header , submit } = props;

    return (
        <div className={open ? 'openModal modal' : 'modal'}>
            {open && 
                <section>
                    <header>
                        {header}
                        <button className='close' onClick={close}>
                            &times;
                        </button>
                    </header>
                    <main>{props.children}</main>
                    <footer>
                    {submit &&
                        <button className='submit' onClick={submit}>Submit</button>
                    }
                        <button className='close' onClick={close}>close</button>
                    </footer>
                </section>
            }
        </div>
    );
};
export default Modal;