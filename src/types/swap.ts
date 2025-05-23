export type SwapStatus = 'proposed' | 'accepted' | 'rejected' | 'cancelled';

export type Swap = {
  swap_id: string;
  shift_id: string;
  requester_id: string;
  receiver_id: string;
  status: SwapStatus;
  created_at: string; // ISO timestamp
};
