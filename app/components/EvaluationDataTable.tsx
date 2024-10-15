import { useEffect, useState, useRef } from 'react';
import VisibilityIcon from '@mui/icons-material/Visibility';

interface Item {
    id: number;
    firstName: string;
    lastName: string;
    review_title: string;
    primary_video_link: string;
    video_link_two: string;
    video_link_three: string;
    video_description: string;
    status: number;
    created_at: string;
}

interface EvaluationDataTableProps {
    playerId: number | null; // Assuming this is already defined
    status: string | null; // Update type to include null
    limit: number;
    defaultSort: string;// Update this to string | null
}

const EvaluationDataTable: React.FC<EvaluationDataTableProps> = ({ limit, defaultSort, playerId, status }) => {
    const [data, setData] = useState<Item[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [search, setSearch] = useState<string>('');
    const [sort, setSort] = useState<string>(defaultSort);
    const [page, setPage] = useState<number>(1);
    const [total, setTotal] = useState<number>(0);

    // Prevent fetchData from running unnecessarily
    const firstRender = useRef(true); // Helps avoid running the effect immediately after render

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch(`/api/evaluations?search=${search}&sort=${sort}&page=${page}&limit=${limit}&playerId=${playerId || ''}&status=${status || ''}`);
            
            if (response.ok) {
                const data = await response.json();
                setData(data.data);
                setTotal(data.total);
            } else {
                console.error('Failed to fetch data');
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (firstRender.current) {
            firstRender.current = false; // Avoid fetching data on initial render
            return;
        }
        fetchData();
    }, [search, sort, page, playerId]); // Add status only if needed

    const handleSort = (column: string) => {
        setSort(prev => prev.startsWith(column) && prev.endsWith('asc') ? `${column},desc` : `${column},asc`);
    };

    const totalPages = Math.ceil(total / limit); // Calculate total pages

    return (
        <div>
            <input 
                type="text" 
                placeholder="Search..." 
                value={search} 
                onChange={(e) => setSearch(e.target.value)} 
                className='searchBar'
            />
            <table>
                <thead>
                    <tr>
                        <th onClick={() => handleSort('firstName')}>Coach Name</th>
                        <th onClick={() => handleSort('review_title')}>Review Title</th>
                        <th onClick={() => handleSort('primary_video_link')}>Video Link</th>
                        <th onClick={() => handleSort('video_link_two')}>Video Link 2</th>
                        <th onClick={() => handleSort('video_link_three')}>Video Link 3</th>
                        <th onClick={() => handleSort('video_description')}>Video Description</th>
                        <th onClick={() => handleSort('evaluation_status')}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {loading ? (
                        <tr><td colSpan={7}>Loading...</td></tr>
                    ) : (
                        data.map(item => (
                            <tr key={item.id}>
                                <td>{item.firstName} {item.lastName}</td>
                                <td>{item.review_title}</td>
                                <td><a href={item.primary_video_link} target='_blank'><VisibilityIcon className="icon" /></a></td>
                                <td><a href={item.video_link_two} target='_blank'><VisibilityIcon className="icon" /></a> </td>
                                <td><a href={item.video_link_three} target='_blank'><VisibilityIcon className="icon" /> </a></td>
                                <td>{item.video_description}</td>
                                <td> 
                                    {item.status === 0 && (
                                        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Requested</button>
                                    )}
                                    {item.status === 1 && (
                                        <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">Accepted</button>
                                    )}
                                    {item.status === 3 && (
                                        <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600">Completed</button>
                                    )}
                                    {item.status === 4 && (
                                        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Rejected</button>
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
            <div className="pagination">
                <button 
                    onClick={() => setPage(prev => Math.max(prev - 1, 1))} 
                    disabled={page === 1}
                >
                    Previous
                </button>
                <span> Page {page} of {totalPages} </span>
                <button 
                    onClick={() => setPage(prev => (prev < totalPages ? prev + 1 : prev))} 
                    disabled={page === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default EvaluationDataTable;
