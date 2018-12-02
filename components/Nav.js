import {
    Navbar,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink 
    } from 'reactstrap';

import Link from 'next/link'

export default () => (
    <Navbar>
        <Nav pills>
            <Link href="/blog">
            <NavbarBrand href="/blog">Cultlang</NavbarBrand>
            </Link>
          <NavItem>
            <Link href="/blog">
                <NavLink href="/blog">Blog</NavLink>
            </Link>
          </NavItem>
        </Nav>
        <Nav className="" >
            <NavItem>
                <NavLink href="https://cultlang.slack.com/"><i className="fab fa-slack"></i></NavLink>
            </NavItem>
            <NavItem>
                <NavLink href="https://github.com/cultlang/cultlang"><i className="fab fa-github"></i></NavLink>
            </NavItem>
        </Nav>
    </Navbar>
)