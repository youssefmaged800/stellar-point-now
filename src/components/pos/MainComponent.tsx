
import React, { useState, useCallback, useEffect } from 'react';
import { usePOS } from '@/contexts/POSContext';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { CreditCard, Banknote, CheckCircle } from 'lucide-react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  totalAmount: number;
  orderId: string;
  onPaymentComplete: (payment: {
    orderId: string;
    amount: number;
    amountPaid?: number;
  }) => void;
  paymentType: 'cash' | 'card';
}

const PaymentDialog: React.FC<PaymentDialogProps> = ({
  isOpen,
  onClose,
  totalAmount,
  orderId,
  onPaymentComplete,
  paymentType
}) => {
  const [amountPaid, setAmountPaid] = useState<number>(totalAmount);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);
  const { toast } = useToast();
  const { currency } = usePOS();

  const handleComplete = useCallback(() => {
    if (paymentType === 'cash' && amountPaid < totalAmount) {
      toast({
        title: "Payment Error",
        description: "Amount paid must be at least equal to the total amount",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    // Simulate processing time
    setTimeout(() => {
      setIsProcessing(false);
      setIsCompleted(true);
      
      onPaymentComplete({
        orderId,
        amount: totalAmount,
        amountPaid: paymentType === 'cash' ? amountPaid : totalAmount
      });

      toast({
        title: "Payment Successful",
        description: `Order #${orderId} has been paid and sent to the kitchen`,
      });
      
      // Close dialog after showing success for a moment
      setTimeout(() => {
        onClose();
        setIsCompleted(false);
      }, 1500);
    }, 1000);
  }, [amountPaid, totalAmount, orderId, onPaymentComplete, onClose, paymentType, toast]);

  // Reset state when dialog opens
  useEffect(() => {
    if (isOpen) {
      setAmountPaid(totalAmount);
      setIsProcessing(false);
      setIsCompleted(false);
    }
  }, [isOpen, totalAmount]);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isCompleted ? 'Payment Complete' : `${paymentType === 'cash' ? 'Cash' : 'Card'} Payment`}
          </DialogTitle>
        </DialogHeader>
        
        <div className="py-6">
          {isCompleted ? (
            <div className="flex flex-col items-center justify-center">
              <CheckCircle className="w-16 h-16 text-green-500 mb-4" />
              <p className="text-xl font-medium text-center">Payment Successful!</p>
              <p className="text-gray-500 text-center mt-2">
                Order #{orderId} has been sent to the kitchen
              </p>
            </div>
          ) : (
            <>
              <div className="text-center mb-6">
                <p className="text-lg font-medium">Total Amount</p>
                <p className="text-2xl font-bold">{currency} {totalAmount.toFixed(2)}</p>
              </div>
              
              {paymentType === 'cash' && (
                <div className="mb-6">
                  <label className="block text-sm font-medium mb-2">Amount Paid</label>
                  <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                    min={totalAmount}
                    disabled={isProcessing}
                  />
                  
                  {amountPaid > totalAmount && (
                    <div className="mt-2 text-gray-700">
                      <p>Change: {currency} {(amountPaid - totalAmount).toFixed(2)}</p>
                    </div>
                  )}
                </div>
              )}
              
              {paymentType === 'card' && (
                <div className="mb-6 border p-4 rounded-lg bg-gray-50">
                  <p className="text-center text-gray-500 mb-2">
                    Customer will pay using card terminal
                  </p>
                  <div className="flex justify-center">
                    <CreditCard className="w-12 h-12 text-gray-400" />
                  </div>
                </div>
              )}
              
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={onClose}
                  disabled={isProcessing}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleComplete}
                  disabled={isProcessing}
                  className="bg-green-600 hover:bg-green-700"
                >
                  {isProcessing ? 'Processing...' : 'Complete Payment'}
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

const MainComponent: React.FC = () => {
  const [currentOrderId, setCurrentOrderId] = useState<string>("");
  const [showCashPayment, setShowCashPayment] = useState<boolean>(false);
  const [showCardPayment, setShowCardPayment] = useState<boolean>(false);
  const { toast } = useToast();
  
  const { 
    cart, 
    getCartTotal,
    clearCart,
    selectedPayment,
    setSelectedPayment,
    placeOrder,
    currency
  } = usePOS();

  // Generate a new order ID when the component mounts
  useEffect(() => {
    setCurrentOrderId(`order-${Date.now()}`);
  }, []);

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast({
        title: "Cart Empty",
        description: "Please add items to your cart first",
        variant: "destructive",
      });
      return;
    }

    if (selectedPayment === 'cash') {
      setShowCashPayment(true);
    } else if (selectedPayment === 'card') {
      setShowCardPayment(true);
    }
  };

  const handlePaymentComplete = (payment: {
    orderId: string;
    amount: number;
    amountPaid?: number;
  }) => {
    // Place the order in the system
    placeOrder(payment.orderId);
    
    // Reset the order state
    clearCart();
    setCurrentOrderId(`order-${Date.now()}`);
    
    // Close the payment dialogs
    setShowCashPayment(false);
    setShowCardPayment(false);
  };

  return (
    <>
      {/* Payment Sections */}
      <div className="p-4 border-t">
        <div className="flex justify-between mb-2">
          <span className="font-medium">Subtotal:</span>
          <span>{currency} {getCartTotal().toFixed(2)}</span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="font-medium">Tax (10%):</span>
          <span>{currency} {(getCartTotal() * 0.1).toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-lg font-bold mb-4">
          <span>Total:</span>
          <span>{currency} {(getCartTotal() * 1.1).toFixed(2)}</span>
        </div>
        
        <div className="grid grid-cols-2 gap-2 mb-4">
          <button
            onClick={() => setSelectedPayment('cash')}
            className={`p-3 border rounded-md flex flex-col items-center justify-center ${
              selectedPayment === 'cash' ? 'bg-pos-blue text-white' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <Banknote className="mb-1" size={20} />
            <span className="text-sm">Cash</span>
          </button>
          
          <button
            onClick={() => setSelectedPayment('card')}
            className={`p-3 border rounded-md flex flex-col items-center justify-center ${
              selectedPayment === 'card' ? 'bg-pos-blue text-white' : 'bg-gray-50 hover:bg-gray-100'
            }`}
          >
            <CreditCard className="mb-1" size={20} />
            <span className="text-sm">Card</span>
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={clearCart}
            className="p-2 border border-gray-300 rounded-md hover:bg-gray-50"
            disabled={cart.length === 0}
          >
            Clear
          </button>
          
          <button
            onClick={handleCheckout}
            className="p-2 bg-pos-blue text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            disabled={cart.length === 0 || !selectedPayment}
          >
            Pay
          </button>
        </div>
      </div>

      {/* Payment Dialogs */}
      <PaymentDialog
        isOpen={showCashPayment}
        onClose={() => setShowCashPayment(false)}
        totalAmount={getCartTotal() * 1.1}
        orderId={currentOrderId}
        onPaymentComplete={handlePaymentComplete}
        paymentType="cash"
      />

      <PaymentDialog
        isOpen={showCardPayment}
        onClose={() => setShowCardPayment(false)}
        totalAmount={getCartTotal() * 1.1}
        orderId={currentOrderId}
        onPaymentComplete={handlePaymentComplete}
        paymentType="card"
      />
    </>
  );
};

export default MainComponent;
