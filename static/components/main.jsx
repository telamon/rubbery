const React = require('react');
const {
	NavPane,
	NavPaneItem,
	Text,
	Button,
	ProgressCircle
} = require('react-desktop/windows');
class Main extends React.Component {
	loader(){
		if(this.props.state.nav.loader>0){
				return (
	      <ProgressCircle
	        color="#222288"
	        size={100}
	      />
	    );
		}else{
			return null;
		}
	}
	renderNavItem(title,content){
		return (
			<NavPaneItem
				title={title}
				theme="light"
				background="#ffffff"
				selected={this.props.state.nav.selected === title}
				onSelect={() => this.props.send('nav.select',title)}
				padding="10px 20px"
				push
				>
				{content}
				{this.loader()}
			</NavPaneItem>
		);
	}
	render(){
		return (
			<NavPane openLength={200} theme="light" color="#ffffff" push>
				{this.renderNavItem('Home', 'Content 1')}
				{this.renderNavItem('Integrity', 'Content 1')}
				{this.renderNavItem('Firewall', <SectionFirewall state={this.props.state.firewall} send={this.props.send}/> )}
				{this.renderNavItem('Scheduler', 'Content 3')}
			</NavPane>	
		)
	}	
}

class SectionFirewall extends React.Component{
	constructor(props){
		super(props);
		this.send=this.props.send;
	}
	renderRule(rule){
		return (
			<tr key={rule.id}>
				<td><Text>{rule.action}</Text></td>
				<td><Text>{rule.direction}</Text></td>
				<td><Text>{rule.enabled}</Text></td>
				<td><Text>{rule.name}</Text></td>
			</tr>
		);
	}
	render(){
		return ( 
			<div>
				<table>
					<thead>
						<tr>
							<th><Text>Action</Text></th>
							<th><Text>Direction</Text></th>
							<th><Text>Enabled</Text></th>
							<th><Text>Name</Text></th>
						</tr>
					</thead>
					<tbody>
						{this.props.state.rules.map((rule)=> this.renderRule(rule))}
					</tbody>
				</table>
			</div>
		)	
	}
}
module.exports=Main;