namespace KnowledgeCenter.Common
{
    public class BasePagination
    {
        public int Page { get; set; } = 1;

        private int size = 100;
        public int Size { 
            get {
                return size;
            }
            set {
                if(value == 0) {
                    size = 10000;
                } else {
                    size = value;
                }
            }
        }
    }
}
