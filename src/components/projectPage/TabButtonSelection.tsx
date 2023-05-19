import React, { Dispatch, SetStateAction, useContext, useState } from 'react'
import { Stack, Button } from '@mui/material'
import theme from '../../themes/custom1'
import TabButton from './TabButton'
import { ProjectContext } from '../../routes/ProjectPage'
import AddIcon from '@mui/icons-material/Add';
import EditTabNameDialog from './dialogs/EditTabNameDialog'

interface TabButtonsProps {
	selectedTab: number
	setSelectedTab: Dispatch<SetStateAction<number>>

}

export default function TabButtonSelection({ selectedTab, setSelectedTab }: TabButtonsProps) {

	const { project, setProjectChanges, checkIsEdit } = useContext(ProjectContext);
	const [isDialogOpen, setIsDialogOpen] = useState(false);

	const handleAddBtnClick = () => {
		project.content.push({
			tabName: 'New Tab',
			tabContent: [
				{
					type: 'text',
					value: []
				}
			]
		})
		setProjectChanges({
			'content': project.content
		})
		setSelectedTab(project.content.length - 1)
	}

	return (
		<Stack
			className='tab-btns'
			flexDirection={'row'}
			justifyContent={'center'}
			alignItems={'center'}
			mb={2}
			pb={3}
			borderBottom={`2px solid ${theme.customColors.DividerGrey}`}
			width={'90%'}
			flexWrap={'wrap'}
		>
			
			{
				project.content.map((tab, index) => (
					<TabButton
						key={tab._id || index }
						isSelected={selectedTab === index}
						value={tab.tabName}
						setSelected={setSelectedTab}
						index={index}
					/>
				))
			}

			{checkIsEdit() &&
				<Button
					color='neutral'
					variant='outlined'
					size='small'
					onClick={() => {handleAddBtnClick()}}
					sx={{
						py: 0.5,
						px: 2,
						// height: '80%'
					}}
					startIcon={
						<AddIcon sx={{ fontSize: 16 }} />
					}
				>
					Add Tab
				</Button>
			}
		</Stack>
	)
}
