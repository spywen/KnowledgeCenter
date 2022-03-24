using HtmlAgilityPack;
using System.ComponentModel.DataAnnotations;
using System.Web;

namespace KnowledgeCenter.Common.Validators
{
    public class HtmlTextSizeValidator : ValidationAttribute
    {
        private int MinSize { get; set; }
        private int MaxSize { get; set; }

        public HtmlTextSizeValidator(int minSize, int maxSize)
        {
            MinSize = minSize;
            MaxSize = maxSize;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            var doc = new HtmlDocument();
            doc.LoadHtml(value.ToString());

            if (HttpUtility.HtmlDecode(doc.DocumentNode.InnerText).Length < MinSize)
            {
                return new ValidationResult($"Too short html text provided (min size allwoed: {MinSize})");
            }

            if (HttpUtility.HtmlDecode(doc.DocumentNode.InnerText).Length > MaxSize)
            {
                return new ValidationResult($"Too long html text provided (max size allwoed: {MaxSize})");
            }

            return ValidationResult.Success;
        }
    }
}
