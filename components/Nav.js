import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink 
    } from 'reactstrap';
export default () => (
    <Navbar>
        <NavbarBrand>Cultlang</NavbarBrand>
        <Nav className="" >
            <NavItem>
                <NavLink href="https://cultlang.slack.com/"><i class="fab fa-slack"></i></NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="https://github.com/cultlang/cultlang"><i class="fab fa-github"></i></NavLink>
            </NavItem>
        </Nav>
    </Navbar>
)