import React, {Component} from 'react'

class PageContainer extends Component{

    componentDidMount() {
        if(this.props.updatePath && this.props.location) this.props.updatePath(this.props.location.pathname)
    }

    render(){ 
        return (<div></div>)
    }
    
}
export default PageContainer