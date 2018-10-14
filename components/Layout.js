import {Container} from 'reactstrap';

import Head from './Head';
import Nav from './Nav';
import Footer from './Footer';

export default (props) => (
    <Container>
        <Head />
        <Nav />
        {props.children}
        <Footer />
    </Container>
)