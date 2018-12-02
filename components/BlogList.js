import blog from './blog';
import { Media } from 'reactstrap';
var Remarkable = require('remarkable');
var meta = require('remarkable-meta');



const _render = (h)=> {
    return {
        __html: h
    }
}
export default () => {
    return (
        <div>
            {
                Object.keys(blog).map((e) => {
                    var md = new Remarkable();
                    md.use(meta);
                    return {
                        html: md.render(blog[e]),
                        meta: {...md.meta}
                    }
                }).sort((a, b) => {
                    return new Date(b.meta.date) - new Date(a.meta.date);
                })
                .map((e, i) => {

                    return (
                        <Media key={i} style={{marginBottom: "2em", border: "1px solid #d8d8d8"}}>
                            <Media body>
                                <Media heading>
                                {new Date(e.meta.date).toISOString()}
                                </Media>
                                <div
                                    className="content"
                                    dangerouslySetInnerHTML={_render(e.html)}
                                />
                            </Media>
                        </Media>
                    )
                })
            }
        </div>
    )
    
}