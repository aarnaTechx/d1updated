"use client";
import { useState, useEffect } from 'react';
import { CellProps } from 'react-table';
import React from 'react';

import '../../globals.css'; // Import CSS module
import Sidebar from '../../components/coach/Sidebar';
import { useTable,Column } from 'react-table';
import { Evaluation, EvaluationsByStatus } from '../../types/types';
import Modal from '../../components/Modal';
import AcceptanceModal from '@/app/components/coach/AcceptanceModal';
import { useSession, signOut } from 'next-auth/react';
import EvaluationForm from '@/app/components/coach/EvaluationForm';
import { FaEye } from 'react-icons/fa';

const Dashboard: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAcceptOpen, setIsAcceptOpen] = useState(false);
  const [isEvFormOpen, setIsEvFormOpen] = useState(false);
  const [evaluationId, setEvaluationId] = useState<number | undefined>(undefined);
  const [coachId, setCoachId] = useState<number | undefined>(undefined);
  const [playerId, setPlayerId] = useState<number | undefined>(undefined);
  const { data: session, status } = useSession();
  const [loading, setLoading] = useState<boolean>(true); 


  const [evaluationData, setEvaluationData] = useState<Evaluation | undefined>(undefined);



  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [evaluations, setEvaluations] = useState<EvaluationsByStatus>({
    Requested: [],
    Accepted: [],
    Completed: [],
    Declined: [],
  });
  const [selectedTab, setSelectedTab] = useState<string>('0');
  const [data, setData] = useState<Evaluation[]>([]);

  const fetchEvaluations = async (status: string, coachId:number) => {
    setLoading(true);
    const response = await fetch('/api/coach/evaluations', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status, coachId }),
    });

    if (!response.ok) {
      setLoading(false);
      throw new Error('Failed to fetch evaluations');
    }

    const evaluationsData = await response.json();
    setEvaluations(prev => ({
      ...prev,
      [status]: evaluationsData,
    }));

    setData(evaluationsData);
    setLoading(false);
  };

  

  const columns = React.useMemo<Column<Evaluation>[]>(
    () => [
      {
        Header: 'Sr No.',
        Cell: ({ row }: CellProps<Evaluation>) => row.index + 1,
      },
      {
        Header: 'Player Name',
        accessor: 'first_name', // Accessing Evaluation's first_name property
        Cell: ({ row }: CellProps<Evaluation>) => `${row.original.first_name} ${row.original.last_name}`,
      },
      { 
        Header: 'Evaluation Title', 
        accessor: 'review_title' 
        
      },
      {
        Header: 'Video Link',
        accessor: 'primary_video_link',  // Accessing Evaluation's primary_video_link property
        Cell: ({ value }: { value: string }) => (
          <a href={value} target="_blank" rel="noopener noreferrer">
            Watch
          </a>
        ),
      },
      { 
        Header: 'Description', 
        accessor: 'video_description'  // Accessing Evaluation's video_description property
      },
     
      {
        Header: 'Action',
        Cell: ({ row }: CellProps<Evaluation>) => {
          const evaluation = row.original;
          if (selectedTab === '0') {
            return (
              <button
                onClick={() => handleRequestedAction(evaluation)}
                className="bg-blue-500 text-white px-4 py-2 rounded"
              >
                Action
              </button>
            );
          } else if (selectedTab === '1') {
            return (
              <button
                onClick={() => handleAcceptedAction(evaluation)}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Evaluate
              </button>
            );
          } else {
            return <a  onClick={() => handleEvaluationDetails(evaluation)}><FaEye></FaEye></a>;
          }
        },
      },
    ],
    [selectedTab]
  );

  const handleRequestedAction = (evaluation: Evaluation) => {
    console.log(evaluation);
    setEvaluationId(evaluation.evaluationId);
    setCoachId(evaluation.coachId);
    setPlayerId(evaluation.playerId);

    setIsAcceptOpen(true);
  };

  const handleEvaluationDetails=(evaluation: Evaluation)=>{
    
    window.open(`/evaluationdetails?evaluationId=${evaluation.evaluationId}`, '_blank');
  }

  const handleAcceptedAction = (evaluation: Evaluation) => {
    setEvaluationId(evaluation.evaluationId);
    setCoachId(evaluation.coachId);
    setPlayerId(evaluation.playerId);
    console.log(evaluation);
    setEvaluationData(evaluation);
    setIsEvFormOpen(true);

  };

  const tableInstance = useTable({ columns, data });

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
  };

  const closeAcceptanceModal = () => {
    console.log("Closing Acceptance Modal"); // Debugging log
    setIsAcceptOpen(false);
  };

  const closeEvform = () => {
    setIsEvFormOpen(false);
  };
  useEffect(() => {
    if (session) {
      const coachId = Number(session.user.id);
      if (!isNaN(coachId)) {
        fetchEvaluations(selectedTab, coachId);
      } else {
        console.error("Invalid coach ID");
      }
    }
  }, [session,selectedTab]);

  useEffect(() => {
   
  }, []);
  return (
    <>
      <Modal isOpen={isModalOpen} onClose={closeModal}>
        {modalContent}
      </Modal>
      <AcceptanceModal

evaluationId={evaluationId} // Pass the appropriate evaluation ID if needed
        isOpen={isAcceptOpen}
        onClose={closeAcceptanceModal}
      />

      <EvaluationForm  evaluationId={evaluationId ?? null} evaluationData={evaluationData ?? null} coachId={coachId ?? null} playerId={playerId ?? null} isOpen={isEvFormOpen} onClose={closeEvform} />


      <div className="flex h-screen">
        <Sidebar />
        <main className="flex-grow bg-gray-100 p-4">
          <div className="bg-white shadow-md rounded-lg p-6">
            <div className="flex space-x-4 mb-4">
              {[
                { name: 'Requested', value: '0' },
                { name: 'Accepted', value: '1' },
                { name: 'Completed', value: '2' },
                { name: 'Declined', value: '3' },
              ].map(tab => (
                <button
                  key={tab.value} // This is good
                  onClick={() => setSelectedTab(tab.value)}
                  className={`p-2 border-b-2 ${selectedTab === tab.value ? 'border-blue-500 font-bold' : 'border-transparent'}`}
                >
                  {tab.name}
                </button>
              ))}
            </div>

            {/* Table to display evaluations */}
            <table {...tableInstance.getTableProps()} className="min-w-full bg-white border border-gray-300">
              <thead>
                {tableInstance.headerGroups.map(headerGroup => (
                  <tr {...headerGroup.getHeaderGroupProps()} key={headerGroup.id}> {/* Add key here */}
                    {headerGroup.headers.map(column => (
                      <th {...column.getHeaderProps()} key={column.id} className="border-b-2 border-gray-200 bg-gray-100 px-4 py-2 text-left text-gray-600">
                        {column.render('Header')}
                      </th>
                    ))}
                  </tr>
                ))}
              </thead>


              <tbody {...tableInstance.getTableBodyProps()}>
              {loading ? (
                // Display loader rows when loading
                <tr>
                  <td colSpan={columns.length} className="text-center py-4">
                  Loading...
                  </td>
                </tr>
              ) : (
  tableInstance.rows.map(row => {
    tableInstance.prepareRow(row);
    return (
      <tr {...row.getRowProps()} key={row.id}> {/* Unique key for row */}
        {row.cells.map(cell => (
          <td {...cell.getCellProps()} key={`${row.id}-${cell.column.id}`} className="border-b border-gray-200 px-4 py-2">
            {cell.render('Cell')}
          </td>
        ))}
      </tr>
    );
  })
)}
</tbody>

            </table>
          </div>
        </main>
      </div>
    </>
  );
};

export default Dashboard;
